import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    PromptInputComponent,
    PromptInputToolbarComponent,
    PromptInputToolsComponent,
    PromptInputSubmitComponent,
    PromptInputStatus
} from '../../../../../../tolle/src/lib/prompt-input.component';
import { ShimmerComponent } from '../../../../../../tolle/src/lib/shimmer.component';

@Component({
    selector: 'app-prompt-input-streaming',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        PromptInputComponent,
        PromptInputToolbarComponent,
        PromptInputToolsComponent,
        PromptInputSubmitComponent,
        ShimmerComponent
    ],
    templateUrl: './prompt-input-streaming.component.html'
})
export class PromptInputStreamingComponent implements OnDestroy {
    message = '';
    status: PromptInputStatus = 'ready';
    /** The prompt that was sent, echoed above the answer. */
    prompt = '';
    /** The answer so far, so stopping leaves the partial response behind. */
    response = '';

    private readonly words = [
        'Sure', '—', 'the', 'short', 'version:', 'keep', 'the', 'padding', 'on',
        'the', 'composer', 'and', 'let', 'the', 'tool', 'row', 'inherit', 'it.'
    ];
    private timer?: ReturnType<typeof setInterval>;

    /** Enter (or the send button) submits, and the composer clears itself. */
    onSubmitted(text: string): void {
        this.prompt = text;
        this.response = '';
        this.status = 'streaming';

        let index = 0;
        this.clearTimer();
        this.timer = setInterval(() => {
            if (index >= this.words.length) {
                this.clearTimer();
                this.status = 'ready';
                return;
            }
            this.response += (index ? ' ' : '') + this.words[index];
            index++;
        }, 160);
    }

    /** While streaming the submit button is a stop button, and emits this. */
    onStopped(): void {
        this.clearTimer();
        this.status = 'ready';
        if (this.response) this.response += ' …';
    }

    ngOnDestroy(): void {
        this.clearTimer();
    }

    private clearTimer(): void {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}
