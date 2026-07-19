import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  InputGroupComponent,
  InputGroupAddonComponent,
  InputGroupButtonComponent,
  InputGroupTextComponent,
  InputGroupInputComponent,
  InputGroupTextareaComponent,
} from './input-group.component';

describe('InputGroupComponent', () => {
  it('should create', () => {
    const fixture = TestBed.configureTestingModule({ imports: [InputGroupComponent] }).createComponent(
      InputGroupComponent
    );
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('applies the invalid ring', () => {
    const fixture = TestBed.configureTestingModule({ imports: [InputGroupComponent] }).createComponent(
      InputGroupComponent
    );
    fixture.componentInstance.invalid = true;

    expect(fixture.componentInstance.computedClass).toContain('border-destructive');
  });

  it('drops the fixed row height when stacked', () => {
    const fixture = TestBed.configureTestingModule({ imports: [InputGroupComponent] }).createComponent(
      InputGroupComponent
    );
    const instance = fixture.componentInstance;

    expect(instance.computedClass).toContain('h-10');

    instance.stacked = true;
    expect(instance.computedClass).toContain('flex-col');
    expect(instance.computedClass).not.toContain('h-10');
  });
});

describe('InputGroupAddonComponent', () => {
  const make = () =>
    TestBed.configureTestingModule({ imports: [InputGroupAddonComponent] }).createComponent(
      InputGroupAddonComponent
    );

  it('orders inline-start first and inline-end last', () => {
    const fixture = make();
    expect(fixture.componentInstance.computedClass).toContain('order-first');

    fixture.componentInstance.align = 'inline-end';
    expect(fixture.componentInstance.computedClass).toContain('order-last');
  });

  it('spans the full width for block alignments', () => {
    const fixture = make();
    fixture.componentInstance.align = 'block-end';

    expect(fixture.componentInstance.computedClass).toContain('w-full');
    expect(fixture.componentInstance.computedClass).toContain('border-t');
  });
});

describe('InputGroupButtonComponent', () => {
  it('defaults to a square ghost icon button', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputGroupButtonComponent],
    }).createComponent(InputGroupButtonComponent);

    expect(fixture.componentInstance.computedClass).toContain('w-7');
  });

  it('emits clicked with the event', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputGroupButtonComponent],
    }).createComponent(InputGroupButtonComponent);
    const spy = jasmine.createSpy('clicked');
    fixture.componentInstance.clicked.subscribe(spy);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(spy).toHaveBeenCalled();
  });

  it('renders type=button so it never submits a form by accident', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputGroupButtonComponent],
    }).createComponent(InputGroupButtonComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').getAttribute('type')).toBe('button');
  });
});

describe('InputGroupInputComponent', () => {
  const make = () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputGroupInputComponent],
    }).createComponent(InputGroupInputComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('writes a value through the CVA', () => {
    const fixture = make();
    fixture.componentInstance.writeValue('hello');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input').value).toBe('hello');
  });

  it('propagates typing to registerOnChange and valueChange', () => {
    const fixture = make();
    const onChange = jasmine.createSpy('onChange');
    const valueChange = jasmine.createSpy('valueChange');
    fixture.componentInstance.registerOnChange(onChange);
    fixture.componentInstance.valueChange.subscribe(valueChange);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'typed';
    input.dispatchEvent(new Event('input'));

    expect(onChange).toHaveBeenCalledWith('typed');
    expect(valueChange).toHaveBeenCalledWith('typed');
  });

  it('ignores input while readonly', () => {
    const fixture = make();
    const onChange = jasmine.createSpy('onChange');
    fixture.componentInstance.registerOnChange(onChange);
    fixture.componentInstance.readonly = true;
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'typed';
    input.dispatchEvent(new Event('input'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables via setDisabledState', () => {
    const fixture = make();
    fixture.componentInstance.setDisabledState(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input').disabled).toBe(true);
  });

  it('stays borderless so the group owns the focus ring', () => {
    const fixture = make();
    expect(fixture.componentInstance.computedClass).toContain('border-none');
  });
});

describe('InputGroupTextareaComponent', () => {
  it('propagates typing through the CVA', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputGroupTextareaComponent],
    }).createComponent(InputGroupTextareaComponent);
    fixture.detectChanges();

    const onChange = jasmine.createSpy('onChange');
    fixture.componentInstance.registerOnChange(onChange);

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    textarea.value = 'note';
    textarea.dispatchEvent(new Event('input'));

    expect(onChange).toHaveBeenCalledWith('note');
  });
});

@Component({
  standalone: true,
  imports: [
    InputGroupComponent,
    InputGroupAddonComponent,
    InputGroupInputComponent,
    InputGroupTextComponent,
  ],
  template: `
    <tolle-input-group>
      <tolle-input-group-addon><i class="ri-search-line"></i></tolle-input-group-addon>
      <tolle-input-group-input placeholder="Search"></tolle-input-group-input>
      <tolle-input-group-addon align="inline-end">
        <tolle-input-group-text>.com</tolle-input-group-text>
      </tolle-input-group-addon>
    </tolle-input-group>
  `,
})
class HostComponent {}

describe('InputGroup composition', () => {
  it('renders addons on both sides of the input', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(
      HostComponent
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.ri-search-line')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('.com');
  });
});
