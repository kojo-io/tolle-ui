import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ComboboxComponent, ComboboxOption } from './combobox.component';

describe('ComboboxComponent', () => {
  let component: ComboboxComponent;
  let fixture: ComponentFixture<ComboboxComponent>;

  const OPTIONS: ComboboxOption[] = [
    { label: 'Next.js', value: 'next' },
    { label: 'SvelteKit', value: 'svelte' },
    { label: 'Nuxt', value: 'nuxt', disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ComboboxComponent] }).compileComponents();

    fixture = TestBed.createComponent(ComboboxComponent);
    component = fixture.componentInstance;
    component.options = OPTIONS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the placeholder until a value is set', () => {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(trigger.textContent).toContain(component.placeholder);
  });

  it('resolves the trigger label from the selected value', () => {
    component.writeValue('svelte');
    fixture.detectChanges();

    expect(component.selectedLabel).toBe('SvelteKit');
    expect(fixture.nativeElement.querySelector('button').textContent).toContain('SvelteKit');
  });

  it('falls back to an empty label when the value matches no option', () => {
    component.writeValue('does-not-exist');
    fixture.detectChanges();

    expect(component.selectedLabel).toBe('');
  });

  describe('open state', () => {
    it('reflects open state on aria-expanded and data-state', fakeAsync(() => {
      const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      component.open();
      tick();
      fixture.detectChanges();

      expect(component.isOpen).toBe(true);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(trigger.getAttribute('data-state')).toBe('open');
    }));

    it('does not open while disabled', fakeAsync(() => {
      component.setDisabledState(true);
      fixture.detectChanges();

      component.open();
      tick();

      expect(component.isOpen).toBe(false);
    }));

    it('opens from the keyboard on ArrowDown', fakeAsync(() => {
      component.onTriggerKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      tick();

      expect(component.isOpen).toBe(true);
    }));

    it('emits opened and closed', fakeAsync(() => {
      const opened = jasmine.createSpy('opened');
      const closed = jasmine.createSpy('closed');
      component.opened.subscribe(opened);
      component.closed.subscribe(closed);

      component.open();
      tick();
      component.close();
      tick();

      expect(opened).toHaveBeenCalled();
      expect(closed).toHaveBeenCalled();
    }));
  });

  describe('selection', () => {
    it('writes through the CVA on select', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.onSelect('next');

      expect(component.value).toBe('next');
      expect(onChange).toHaveBeenCalledWith('next');
    });

    it('emits valueChange on select', () => {
      const spy = jasmine.createSpy('valueChange');
      component.valueChange.subscribe(spy);

      component.onSelect('next');

      expect(spy).toHaveBeenCalledWith('next');
    });

    it('closes after selecting by default', fakeAsync(() => {
      component.open();
      tick();

      component.onSelect('next');

      expect(component.isOpen).toBe(false);
    }));

    it('stays open when closeOnSelect is false', fakeAsync(() => {
      component.closeOnSelect = false;
      component.open();
      tick();

      component.onSelect('next');

      expect(component.isOpen).toBe(true);
    }));

    it('marks the control touched on close', fakeAsync(() => {
      const onTouched = jasmine.createSpy('onTouched');
      component.registerOnTouched(onTouched);
      component.open();
      tick();

      component.close();

      expect(onTouched).toHaveBeenCalled();
    }));
  });

  it('applies the invalid styling to the trigger', () => {
    component.invalid = true;
    fixture.detectChanges();

    expect(component.computedTriggerClass).toContain('border-destructive');
  });

  it('merges consumer classes last so they win', () => {
    component.class = 'h-20';
    expect(component.computedTriggerClass).toContain('h-20');
  });

  it('tears down listeners on destroy without throwing', fakeAsync(() => {
    component.open();
    tick();

    expect(() => fixture.destroy()).not.toThrow();
  }));
});
