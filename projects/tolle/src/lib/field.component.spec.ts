import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  FieldComponent,
  FieldLabelComponent,
  FieldDescriptionComponent,
  FieldErrorComponent,
  FieldLegendComponent,
} from './field.component';

describe('FieldComponent', () => {
  let fixture: ComponentFixture<FieldComponent>;
  let component: FieldComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FieldComponent] }).compileComponents();
    fixture = TestBed.createComponent(FieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('stacks vertically by default', () => {
    expect(component.computedClass).toContain('flex-col');
  });

  it('goes horizontal at the md breakpoint when responsive', () => {
    component.orientation = 'responsive';
    // Container-query classes are not available in this Tailwind build, so the
    // responsive orientation must rely on viewport breakpoints.
    expect(component.computedClass).toContain('md:flex-row');
    expect(component.computedClass).not.toContain('@md');
  });

  it('sets data-invalid only when invalid', () => {
    const el = () => fixture.nativeElement.querySelector('[role="group"]');
    expect(el().getAttribute('data-invalid')).toBeNull();

    // setInput (not a bare assignment) — the component is OnPush, so a direct
    // property write would never mark it dirty.
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();

    expect(el().getAttribute('data-invalid')).toBe('true');
  });
});

describe('FieldLabelComponent', () => {
  it('links to its control via for', () => {
    const fixture = TestBed.configureTestingModule({ imports: [FieldLabelComponent] }).createComponent(
      FieldLabelComponent
    );
    fixture.componentInstance.for = 'email';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label').getAttribute('for')).toBe('email');
  });

  it('renders a required marker only when required', () => {
    const fixture = TestBed.configureTestingModule({ imports: [FieldLabelComponent] }).createComponent(
      FieldLabelComponent
    );
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('*');

    // setInput, not a bare assignment — the component is OnPush.
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('*');
  });
});

describe('FieldErrorComponent', () => {
  let fixture: ComponentFixture<FieldErrorComponent>;
  let component: FieldErrorComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({ imports: [FieldErrorComponent] }).createComponent(
      FieldErrorComponent
    );
    component = fixture.componentInstance;
  });

  it('renders nothing when there is no error', () => {
    component.errors = '';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('renders a single string message', () => {
    component.errors = 'Email is required';
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert.textContent).toContain('Email is required');
    expect(alert.querySelector('ul')).toBeNull();
  });

  it('renders an array of messages as a list', () => {
    component.errors = ['Too short', 'Needs a number'];
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[1].textContent).toContain('Needs a number');
  });

  it('accepts an Angular ValidationErrors-style object', () => {
    component.errors = { required: 'Email is required', minlength: false };
    fixture.detectChanges();

    expect(component.messages).toEqual(['Email is required']);
  });

  it('treats null errors as empty', () => {
    component.errors = null;
    fixture.detectChanges();

    expect(component.messages).toEqual([]);
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });
});

describe('FieldLegendComponent', () => {
  it('renders a real <legend> element', () => {
    const fixture = TestBed.configureTestingModule({ imports: [FieldLegendComponent] }).createComponent(
      FieldLegendComponent
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('legend')).toBeTruthy();
  });

  it('switches type scale with the variant', () => {
    const fixture = TestBed.configureTestingModule({ imports: [FieldLegendComponent] }).createComponent(
      FieldLegendComponent
    );
    fixture.componentInstance.variant = 'label';

    expect(fixture.componentInstance.computedClass).toContain('text-sm');
  });
});

@Component({
  standalone: true,
  imports: [FieldComponent, FieldLabelComponent, FieldDescriptionComponent],
  template: `
    <tolle-field>
      <tolle-field-label for="email">Email</tolle-field-label>
      <tolle-field-description id="email-hint">We never share it.</tolle-field-description>
    </tolle-field>
  `,
})
class HostComponent {}

describe('Field composition', () => {
  it('projects label and description inside the field', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(
      HostComponent
    );
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector('[role="group"]');
    expect(group.textContent).toContain('Email');
    expect(group.textContent).toContain('We never share it.');
    expect(fixture.nativeElement.querySelector('#email-hint')).toBeTruthy();
  });
});
