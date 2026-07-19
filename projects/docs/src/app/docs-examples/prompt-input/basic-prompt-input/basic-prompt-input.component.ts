import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    PromptInputComponent,
    PromptInputToolbarComponent,
    PromptInputToolsComponent,
    PromptInputSubmitComponent
} from '../../../../../../tolle/src/lib/prompt-input.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-basic-prompt-input',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        PromptInputComponent,
        PromptInputToolbarComponent,
        PromptInputToolsComponent,
        PromptInputSubmitComponent,
        ButtonComponent
    ],
    templateUrl: './basic-prompt-input.component.html'
})
export class BasicPromptInputComponent {
    message = '';
    sent: string[] = [];

    onSubmitted(text: string): void {
        this.sent = [...this.sent, text];
    }
}
