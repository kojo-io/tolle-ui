import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    PromptInputComponent,
    PromptInputToolbarComponent,
    PromptInputToolsComponent,
    PromptInputSubmitComponent,
    PromptInputStatus
} from '../../../../../../tolle/src/lib/prompt-input.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-prompt-input-reactive-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PromptInputComponent,
        PromptInputToolbarComponent,
        PromptInputToolsComponent,
        PromptInputSubmitComponent,
        ButtonComponent
    ],
    templateUrl: './prompt-input-reactive-form.component.html'
})
export class PromptInputReactiveFormComponent {
    form = new FormGroup({
        message: new FormControl<string>('Draft a release note for the composer.', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(120)]
        })
    });

    lastSubmitted = '';

    get messageControl(): FormControl<string> {
        return this.form.controls.message;
    }

    /** `error` paints the border and sets aria-invalid on the textarea. */
    get status(): PromptInputStatus {
        return this.messageControl.invalid && this.messageControl.touched ? 'error' : 'ready';
    }

    get remaining(): number {
        return 120 - this.messageControl.value.length;
    }

    onSubmitted(text: string): void {
        this.lastSubmitted = text;
    }

    toggleDisabled(): void {
        if (this.messageControl.disabled) {
            this.messageControl.enable();
        } else {
            this.messageControl.disable();
        }
    }
}
