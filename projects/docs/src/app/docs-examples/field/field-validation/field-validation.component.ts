import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    FieldComponent,
    FieldLabelComponent,
    FieldDescriptionComponent,
    FieldErrorComponent
} from '../../../../../../tolle/src/lib/field.component';
import {
    InputGroupComponent,
    InputGroupAddonComponent,
    InputGroupInputComponent
} from '../../../../../../tolle/src/lib/input-group.component';

@Component({
    selector: 'app-field-validation',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FieldComponent,
        FieldLabelComponent,
        FieldDescriptionComponent,
        FieldErrorComponent,
        InputGroupComponent,
        InputGroupAddonComponent,
        InputGroupInputComponent
    ],
    templateUrl: './field-validation.component.html'
})
export class FieldValidationComponent {
    username: FormControl<string> = new FormControl('a', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)]
    });

    /** Only surface the error once the control has been touched or edited. */
    get showError(): boolean {
        return this.username.invalid && (this.username.touched || this.username.dirty);
    }

    /** Maps Angular's `ValidationErrors` onto a human message for `tolle-field-error`. */
    get usernameError(): string {
        if (!this.showError) return '';
        if (this.username.hasError('required')) return 'A username is required.';
        if (this.username.hasError('minlength')) return 'Use at least 3 characters.';
        return 'That username is not valid.';
    }
}
