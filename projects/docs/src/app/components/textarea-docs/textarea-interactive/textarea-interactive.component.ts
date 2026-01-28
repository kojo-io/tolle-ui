import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TextareaComponent } from '../../../../../../tolle/src/lib/textarea.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-textarea-interactive',
    imports: [
    FormsModule,
    TextareaComponent,
    CheckboxComponent,
    InputComponent,
    PlaygroundComponent
],
    templateUrl: './textarea-interactive.component.html'
})
export class TextareaInteractiveComponent {
    label = 'Bio';
    placeholder = 'Type your message here.';
    hint = 'This is a helpful hint.';
    errorMessage = 'This field is required.';
    disabled = false;
    readonly = false;
    rows = 3;
    autoGrow = false;
    showCharacterCount = false;
    maxLength = 100;
    hideHintOnFocus = true;
    hideCharacterCountOnFocus = false;

    get playgroundCode(): string {
        const inputs = [
            this.label ? `label="${this.label}"` : '',
            this.placeholder ? `placeholder="${this.placeholder}"` : '',
            this.hint ? `hint="${this.hint}"` : '',
            this.errorMessage ? `errorMessage="${this.errorMessage}"` : '',
            this.disabled ? '[disabled]="true"' : '',
            this.readonly ? '[readonly]="true"' : '',
            this.rows !== 3 ? `[rows]="${this.rows}"` : '',
            this.autoGrow ? '[autoGrow]="true"' : '',
            this.showCharacterCount ? '[showCharacterCount]="true"' : '',
            this.maxLength ? `[maxLength]="${this.maxLength}"` : '',
            !this.hideHintOnFocus ? '[hideHintOnFocus]="false"' : '',
            this.hideCharacterCountOnFocus ? '[hideCharacterCountOnFocus]="true"' : ''
        ].filter(Boolean).join('\n  ');

        return `<tolle-textarea
  ${inputs}
></tolle-textarea>`;
    }
}
