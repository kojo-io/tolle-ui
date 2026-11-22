import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { describedBy, hasMessage } from './form-control-label.component';
import { CheckboxComponent } from './checkbox.component';
import { SwitchComponent } from './switch.component';
import { InputComponent } from './input.component';
import { SelectComponent } from './select.component';
import { SelectItemComponent } from './select-item.component';
import { MultiSelectComponent } from './multi-select.component';
import { ComboboxComponent } from './combobox.component';
import { NativeSelectComponent } from './native-select.component';
import { DatePickerComponent } from './date-picker.component';
import { DateRangePickerComponent } from './date-range-picker.component';
import { DateTimePickerComponent } from './date-time-picker.component';
import { TimePickerComponent } from './time-picker.component';
import { OtpComponent } from './otp.component';
import { SliderComponent } from './slider.component';
import { RadioGroupComponent } from './radio-group.component';
import { RadioItemComponent } from './radio-item.component';

describe('form-control label helpers', () => {
  it('describes by the error when invalid with a message, else by the hint', () => {
    expect(describedBy('x', 'Hint', 'Bad', true)).toBe('x-error');
    expect(describedBy('x', 'Hint', '', true)).toBeNull();
    expect(describedBy('x', 'Hint', 'Bad', false)).toBe('x-hint');
    expect(describedBy('x', '', 'Bad', false)).toBeNull();
    expect(describedBy('x', 'Hint', 'Bad', true, true)).toBeNull();
  });

  it('hasMessage mirrors describedBy', () => {
    expect(hasMessage('Hint', '', false)).toBeTrue();
    expect(hasMessage('', 'Bad', true)).toBeTrue();
    expect(hasMessage('', '', true)).toBeFalse();
    expect(hasMessage('Hint', '', false, true)).toBeFalse();
  });
});

/* ------------------------------------------------------------------------- */
/* An id set on a Tolle control lands on its focusable element, not the host. */
/* ------------------------------------------------------------------------- */

@Component({
  imports: [FormsModule, CheckboxComponent, SwitchComponent, InputComponent, NativeSelectComponent],
  template: `
    <tolle-checkbox id="terms" [(ngModel)]="terms" />
    <label for="terms">Accept</label>

    <tolle-switch id="notify" [(ngModel)]="notify" />
    <label for="notify">Notify</label>

    <tolle-input id="email" />
    <tolle-native-select id="size" [options]="[{ label: 'S', value: 's' }]" />
  `,
})
class OutsideLabelHost {
  terms = false;
  notify = false;
}

describe('outside <label for> reaches the control', () => {
  let fixture: ComponentFixture<OutsideLabelHost>;
  let el: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(OutsideLabelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('moves a static id off the host and onto the focusable element (no duplicates)', () => {
    for (const [tag, id, inner] of [
      ['tolle-checkbox', 'terms', 'button'],
      ['tolle-switch', 'notify', 'button'],
      ['tolle-input', 'email', 'input'],
      ['tolle-native-select', 'size', 'select'],
    ]) {
      expect(el.querySelector(tag)!.hasAttribute('id')).withContext(`${tag} host`).toBeFalse();
      expect(el.querySelectorAll(`#${id}`).length).withContext(`#${id} count`).toBe(1);
      expect(el.querySelector(`#${id}`)!.tagName.toLowerCase()).withContext(`#${id} element`).toBe(inner);
    }
  });

  it('clicking a <label for> toggles the checkbox and switch', async () => {
    (el.querySelector('label[for="terms"]') as HTMLLabelElement).click();
    (el.querySelector('label[for="notify"]') as HTMLLabelElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.terms).toBeTrue();
    expect(fixture.componentInstance.notify).toBeTrue();
  });
});

/* ------------------------------------------------------------------------- */
/* Built-in label / hint / errorMessage on every form control.               */
/* ------------------------------------------------------------------------- */

@Component({
  imports: [
    FormsModule,
    CheckboxComponent,
    SwitchComponent,
    SelectComponent,
    SelectItemComponent,
    MultiSelectComponent,
    ComboboxComponent,
    NativeSelectComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    DateTimePickerComponent,
    TimePickerComponent,
    OtpComponent,
    SliderComponent,
    RadioGroupComponent,
    RadioItemComponent,
  ],
  template: `
    <tolle-checkbox label="Accept terms" [(ngModel)]="accepted" />
    <tolle-switch label="Dark mode" />

    <tolle-select id="sel" label="Country" hint="Where you live" [error]="err" errorMessage="Pick one">
      <tolle-select-item value="gh">Ghana</tolle-select-item>
    </tolle-select>
    <tolle-multi-select id="ms" label="Tags" hint="Any" />
    <tolle-combobox id="cb" label="Framework" ariaLabel="ignored" [invalid]="err" errorMessage="Required" />
    <tolle-native-select id="ns" label="Size" hint="Pick a size" />
    <tolle-date-picker id="dp" label="Start" [invalid]="err" errorMessage="Pick a date" />
    <tolle-date-range-picker id="drp" label="Stay" hint="Check-in to check-out" />
    <tolle-date-time-picker id="dtp" label="Meeting" />
    <tolle-time-picker id="tp" label="Alarm" />
    <tolle-otp id="otp" label="Code" [error]="err" errorMessage="Wrong code" />
    <tolle-slider id="sl" label="Volume" hint="0–100" />
    <tolle-radio-group id="rg" label="Plan" [error]="err" errorMessage="Choose a plan">
      <tolle-radio-item value="free">Free</tolle-radio-item>
    </tolle-radio-group>
  `,
})
class BuiltInLabelHost {
  accepted = false;
  err = false;
}

describe('built-in label / hint / errorMessage', () => {
  let fixture: ComponentFixture<BuiltInLabelHost>;
  let el: HTMLElement;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(BuiltInLabelHost);
    el = fixture.nativeElement;
    await render();
  });

  it('labels each control through <label for> on its focusable element', () => {
    for (const [id, text] of [
      ['sel', 'Country'],
      ['ms', 'Tags'],
      ['cb', 'Framework'],
      ['ns', 'Size'],
      ['dp', 'Start'],
      ['drp', 'Stay'],
      ['dtp', 'Meeting'],
      ['tp', 'Alarm'],
      ['otp', 'Code'],
    ]) {
      const label = el.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
      expect(label).withContext(id).not.toBeNull();
      expect(label!.textContent!.trim()).withContext(id).toBe(text);
      expect(label!.control).withContext(`${id} label.control`).toBe(el.querySelector(`#${id}`) as any);
    }
  });

  it('a visible label replaces ariaLabel as the accessible name', () => {
    expect(el.querySelector('#cb')!.hasAttribute('aria-label')).toBeFalse();
  });

  it('uses aria-labelledby where the control is not labelable (slider thumbs, radio group)', () => {
    expect(el.querySelector('[role="slider"]')!.getAttribute('aria-labelledby')).toBe('sl-label');
    expect(el.querySelector('#sl-label')!.textContent!.trim()).toBe('Volume');
    expect(el.querySelector('[role="radiogroup"]')!.getAttribute('aria-labelledby')).toBe('rg-label');
  });

  it('shows the hint and wires aria-describedby to it', () => {
    expect(el.querySelector('#sel-hint')!.textContent!.trim()).toBe('Where you live');
    expect(el.querySelector('#sel')!.getAttribute('aria-describedby')).toBe('sel-hint');
    expect(el.querySelector('#ns')!.getAttribute('aria-describedby')).toBe('ns-hint');
    expect(el.querySelector('[role="slider"]')!.getAttribute('aria-describedby')).toBe('sl-hint');
  });

  it('swaps the hint for the error message while the control is in error', async () => {
    fixture.componentInstance.err = true;
    await render();
    expect(el.querySelector('#sel-hint')).toBeNull();
    for (const [id, msg] of [
      ['sel', 'Pick one'],
      ['cb', 'Required'],
      ['dp', 'Pick a date'],
      ['otp', 'Wrong code'],
    ]) {
      expect(el.querySelector(`#${id}-error`)?.textContent?.trim()).withContext(id).toBe(msg);
      expect(el.querySelector(`#${id}`)!.getAttribute('aria-describedby')).withContext(id).toBe(`${id}-error`);
      expect(el.querySelector(`#${id}`)!.getAttribute('aria-invalid')).withContext(id).toBe('true');
    }
    expect(el.querySelector('#rg-error')!.textContent!.trim()).toBe('Choose a plan');
  });

  it('renders nothing extra when no label or hint is set', async () => {
    const plain = TestBed.createComponent(SelectComponent);
    plain.detectChanges();
    expect(plain.nativeElement.querySelector('tolle-form-control-label')).toBeNull();
    expect(plain.nativeElement.querySelector('tolle-form-control-message')).toBeNull();
  });

  it('the checkbox label toggles the checkbox', async () => {
    const checkboxLabel = el.querySelector('tolle-checkbox label') as HTMLLabelElement;
    expect(checkboxLabel.textContent!.trim()).toBe('Accept terms');
    checkboxLabel.click();
    await render();
    expect(fixture.componentInstance.accepted).toBeTrue();
  });
});
