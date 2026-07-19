import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReasoningComponent,
    ReasoningTriggerComponent,
    ReasoningContentComponent
} from '../../../../../../tolle/src/lib/reasoning.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-reasoning-streaming',
    standalone: true,
    imports: [
        CommonModule,
        ReasoningComponent,
        ReasoningTriggerComponent,
        ReasoningContentComponent,
        ButtonComponent
    ],
    templateUrl: './reasoning-streaming.component.html'
})
export class ReasoningStreamingComponent implements OnDestroy {
    /** The chunks a model would emit one at a time. */
    private readonly chunks = [
        'Reading the request. ',
        'The user wants the toolbar aligned with the composer padding.\n\n',
        'Checking the theme tokens for the existing spacing scale. ',
        'The composer already applies p-2, so the toolbar should not add its own.\n\n',
        'Settling on p-2 with gap-1 between the tool buttons.'
    ];

    /** Trace text accumulated so far. */
    text = '';
    /** True while chunks are still arriving; drives the "Thinking…" label. */
    streaming = false;
    /** Seconds spent reasoning, reported by the trigger once streaming ends. */
    duration = 0;
    /** Expanded state, kept in sync with the trace via `[(open)]`. */
    open = true;

    private timer?: ReturnType<typeof setInterval>;
    private startedAt = 0;

    start(): void {
        this.stop();

        this.text = '';
        this.duration = 0;
        this.open = true;
        this.streaming = true;
        this.startedAt = Date.now();

        let index = 0;
        this.timer = setInterval(() => {
            if (index >= this.chunks.length) {
                this.finish();
                return;
            }
            this.text += this.chunks[index];
            index++;
        }, 700);
    }

    ngOnDestroy(): void {
        this.stop();
    }

    private finish(): void {
        this.stop();
        this.streaming = false;
        this.duration = (Date.now() - this.startedAt) / 1000;
    }

    private stop(): void {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}
