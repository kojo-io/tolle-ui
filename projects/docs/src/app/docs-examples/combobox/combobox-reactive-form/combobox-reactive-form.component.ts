import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComboboxComponent, ComboboxOption } from '../../../../../../tolle/src/lib/combobox.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-combobox-reactive-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ComboboxComponent, ButtonComponent],
    templateUrl: './combobox-reactive-form.component.html'
})
export class ComboboxReactiveFormComponent {
    currencies: ComboboxOption[] = [
        { label: 'US Dollar', value: 'USD' },
        { label: 'Euro', value: 'EUR' },
        { label: 'British Pound', value: 'GBP' },
        { label: 'Ghana Cedi', value: 'GHS' },
        { label: 'Japanese Yen', value: 'JPY' }
    ];

    form = new FormGroup({
        currency: new FormControl<string | null>('USD', Validators.required)
    });

    get currencyControl(): FormControl<string | null> {
        return this.form.controls.currency;
    }

    toggleDisabled(): void {
        if (this.currencyControl.disabled) {
            this.currencyControl.enable();
        } else {
            this.currencyControl.disable();
        }
    }
}
