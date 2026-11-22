import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { DatePickerComponent } from '../../../../../../tolle/src/lib/date-picker.component';
import { TextareaComponent } from '../../../../../../tolle/src/lib/textarea.component';
import { RadioGroupComponent } from '../../../../../../tolle/src/lib/radio-group.component';
import { RadioItemComponent } from '../../../../../../tolle/src/lib/radio-item.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

/**
 * Every Tolle form control takes the same label / hint / errorMessage inputs,
 * so a form needs no label markup of its own. Note the one naming split: the
 * date/time pickers, combobox and native select flag errors with `invalid`.
 */
@Component({
  selector: 'app-labelled-controls',
  imports: [
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    SelectItemComponent,
    DatePickerComponent,
    TextareaComponent,
    RadioGroupComponent,
    RadioItemComponent,
    CheckboxComponent,
    ButtonComponent,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid w-full max-w-md gap-5">
      <tolle-input
        label="Full name"
        hint="As it appears on your ID"
        formControlName="name"
        [error]="showError('name')"
        errorMessage="Enter your name"></tolle-input>

      <tolle-select
        label="Country"
        placeholder="Choose a country"
        formControlName="country"
        [error]="showError('country')"
        errorMessage="Choose a country">
        <tolle-select-item value="gh">Ghana</tolle-select-item>
        <tolle-select-item value="ng">Nigeria</tolle-select-item>
        <tolle-select-item value="ke">Kenya</tolle-select-item>
      </tolle-select>

      <tolle-date-picker
        label="Start date"
        hint="You can change this later"
        formControlName="start"
        [invalid]="showError('start')"
        errorMessage="Pick a start date"></tolle-date-picker>

      <tolle-radio-group
        label="Plan"
        formControlName="plan"
        [error]="showError('plan')"
        errorMessage="Choose a plan">
        <tolle-radio-item value="free">Free</tolle-radio-item>
        <tolle-radio-item value="pro">Pro</tolle-radio-item>
      </tolle-radio-group>

      <tolle-textarea label="Notes" hint="Optional" formControlName="notes"></tolle-textarea>

      <tolle-checkbox label="I agree to the terms" formControlName="terms"></tolle-checkbox>

      <tolle-button type="submit" class="w-fit">Create account</tolle-button>
    </form>
  `,
})
export class LabelledControlsComponent {
  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    country: new FormControl<string | null>(null, Validators.required),
    start: new FormControl<Date | null>(null, Validators.required),
    plan: new FormControl<string | null>(null, Validators.required),
    notes: new FormControl('', { nonNullable: true }),
    terms: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
  });

  showError(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  submit() {
    this.form.markAllAsTouched();
  }
}
