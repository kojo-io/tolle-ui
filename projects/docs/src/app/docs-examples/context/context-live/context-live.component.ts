import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextComponent } from '../../../../../../tolle/src/lib/context.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-context-live',
    standalone: true,
    imports: [CommonModule, ContextComponent, ButtonComponent],
    templateUrl: './context-live.component.html'
})
export class ContextLiveComponent {
    readonly total = 32_000;

    inputTokens = 2_400;
    outputTokens = 900;

    /** Tokens consumed so far — the prompt plus everything the model produced. */
    get used(): number {
        return this.inputTokens + this.outputTokens;
    }

    /** Rough spend for the session, rounded for display. */
    get cost(): number {
        return Math.round((this.inputTokens * 3e-6 + this.outputTokens * 1.5e-5) * 1000) / 1000;
    }

    send(): void {
        this.inputTokens += 2_600;
        this.outputTokens += 1_400;
    }

    reset(): void {
        this.inputTokens = 2_400;
        this.outputTokens = 900;
    }
}
