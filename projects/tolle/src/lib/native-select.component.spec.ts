import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeSelectComponent, NativeSelectOption } from './native-select.component';

describe('NativeSelectComponent', () => {
  let component: NativeSelectComponent;
  let fixture: ComponentFixture<NativeSelectComponent>;

  const numericOptions: NativeSelectOption[] = [
    { label: 'One', value: 1 },
    { label: 'Two', value: 2 },
    { label: 'Three', value: 3, disabled: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NativeSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NativeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const select = (): HTMLSelectElement => fixture.nativeElement.querySelector('select');
  const options = (): HTMLOptionElement[] => Array.from(fixture.nativeElement.querySelectorAll('option'));

  /**
   * Picks an option by its visible label and fires `change`, the way a user
   * would. Deliberately does NOT assume how the component encodes option values
   * into the DOM — that encoding is an implementation detail.
   */
  const choose = (label: string) => {
    const option = options().find((o) => o.textContent!.trim() === label);
    if (!option) throw new Error(`No option labelled "${label}"`);
    select().value = option.value;
    select().dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a native select element', () => {
    expect(select()).toBeTruthy();
    expect(select().tagName.toLowerCase()).toBe('select');
  });

  it('renders one option per entry in options', () => {
    fixture.componentRef.setInput('options', numericOptions);
    fixture.detectChanges();

    expect(options().length).toBe(3);
    expect(options().map((o) => o.textContent!.trim())).toEqual(['One', 'Two', 'Three']);
  });

  it('marks disabled options as disabled', () => {
    fixture.componentRef.setInput('options', numericOptions);
    fixture.detectChanges();

    expect(options()[2].disabled).toBe(true);
    expect(options()[0].disabled).toBe(false);
  });

  it('renders a disabled placeholder option when placeholder is set', () => {
    fixture.componentRef.setInput('options', numericOptions);
    fixture.componentRef.setInput('placeholder', 'Pick a number');
    fixture.detectChanges();

    const first = options()[0];
    expect(options().length).toBe(4);
    expect(first.textContent!.trim()).toBe('Pick a number');
    expect(first.disabled).toBe(true);
    expect(first.value).toBe('');
  });

  it('does not render a placeholder option by default', () => {
    fixture.componentRef.setInput('options', numericOptions);
    fixture.detectChanges();

    expect(options().length).toBe(3);
  });

  describe('writeValue', () => {
    it('stores the value and selects the matching option', () => {
      fixture.componentRef.setInput('options', numericOptions);
      fixture.detectChanges();

      component.writeValue(2);
      fixture.detectChanges();

      expect(component.value).toBe(2);
      // Assert the SELECTED OPTION, not the DOM value string — how option
      // values are encoded is an implementation detail.
      expect(options()[1].selected).toBe(true);
      expect(options()[1].textContent!.trim()).toBe('Two');
    });

    it('selects the placeholder when the value is null', () => {
      fixture.componentRef.setInput('options', numericOptions);
      fixture.componentRef.setInput('placeholder', 'Pick a number');
      fixture.detectChanges();

      component.writeValue(null);
      fixture.detectChanges();

      expect(options()[0].selected).toBe(true);
    });
  });

  describe('onSelectChange', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('options', numericOptions);
      fixture.detectChanges();
    });

    it('reports the ORIGINAL option value, not the stringified DOM value', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      choose('Two');

      expect(onChange).toHaveBeenCalledWith(2);
      const reported = onChange.calls.mostRecent().args[0];
      expect(typeof reported).toBe('number');
      expect(reported).not.toBe('2' as any);
      expect(component.value).toBe(2);
    });

    it('emits the original value through valueChange', () => {
      const emitted: any[] = [];
      component.valueChange.subscribe((v) => emitted.push(v));

      choose('One');

      expect(emitted).toEqual([1]);
      expect(typeof emitted[0]).toBe('number');
    });

    it('round-trips object option values by identity', () => {
      // A select coerces every option value to a string, so all objects would
      // collapse to "[object Object]" and become indistinguishable. The
      // component must not resolve the choice by stringifying.
      const alpha = { id: 'a', name: 'Alpha' };
      const beta = { id: 'b', name: 'Beta' };
      fixture.componentRef.setInput('options', [
        { label: 'Alpha', value: alpha },
        { label: 'Beta', value: beta }
      ]);
      fixture.detectChanges();

      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      choose('Beta');

      expect(onChange.calls.mostRecent().args[0]).toBe(beta);
      expect(component.value).toBe(beta);
    });

    it('keeps string option values as strings', () => {
      fixture.componentRef.setInput('options', [
        { label: 'Alpha', value: 'alpha' },
        { label: 'Beta', value: 'beta' }
      ]);
      fixture.detectChanges();

      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      select().selectedIndex = 1;
      select().dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith('beta');
      expect(component.value).toBe('beta');
    });

    it('falls back to the raw string when no option matches', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();

      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.onSelectChange({ target: { value: 'projected' } } as unknown as Event);

      expect(onChange).toHaveBeenCalledWith('projected');
      expect(component.value).toBe('projected');
    });
  });

  it('calls the registered touched callback on blur', () => {
    const onTouched = jasmine.createSpy('onTouched');
    component.registerOnTouched(onTouched);

    select().dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(onTouched).toHaveBeenCalled();
  });

  describe('setDisabledState', () => {
    it('disables the underlying select', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      expect(component.disabled).toBe(true);
      expect(select().disabled).toBe(true);
    });

    it('re-enables the underlying select', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      component.setDisabledState(false);
      fixture.detectChanges();

      expect(component.disabled).toBe(false);
      expect(select().disabled).toBe(false);
    });
  });

  it('applies the default size classes', () => {
    expect(select().className).toContain('h-10');
  });

  it('changes classes when the size input changes', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    expect(select().className).toContain('h-11');
    expect(select().className).not.toContain('h-10');
  });

  it('applies the invalid styling and aria-invalid', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();

    expect(select().className).toContain('border-destructive');
    expect(select().getAttribute('aria-invalid')).toBe('true');
  });

  it('omits aria-invalid when valid', () => {
    expect(select().getAttribute('aria-invalid')).toBeNull();
  });

  it('applies an accessible label when ariaLabel is set', () => {
    fixture.componentRef.setInput('ariaLabel', 'Country');
    fixture.detectChanges();

    expect(select().getAttribute('aria-label')).toBe('Country');
  });

  it('merges extra classes passed through the class input', () => {
    fixture.componentRef.setInput('class', 'my-custom-select');
    fixture.detectChanges();

    expect(select().className).toContain('my-custom-select');
  });
});
