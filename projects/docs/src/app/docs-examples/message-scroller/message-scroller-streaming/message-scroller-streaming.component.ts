import { Component, OnDestroy } from '@angular/core';
import {
    MessageScrollerComponent,
    MessageScrollerViewportComponent,
    MessageScrollerContentComponent,
    MessageScrollerButtonComponent,
    MessageScrollerItemDirective
} from '../../../../../../tolle/src/lib/message-scroller.component';
import {
    MessageComponent,
    MessageAvatarComponent,
    MessageContentComponent,
    MessageAlign
} from '../../../../../../tolle/src/lib/message.component';
import { BubbleComponent } from '../../../../../../tolle/src/lib/bubble.component';
import { MarkerComponent } from '../../../../../../tolle/src/lib/marker.component';

interface Turn {
    id: number;
    align: MessageAlign;
    text: string;
    startsTurn: boolean;
}

const REPLY =
    'Rate limiting is applied per API key rather than per IP, because a single customer often runs several ' +
    'workers behind one NAT gateway and we do not want them to throttle each other. The counter is a sliding ' +
    'window in Redis with a one-second resolution, which is precise enough to be fair and cheap enough to run ' +
    'on every request. When a key exceeds its budget the response carries a Retry-After header computed from ' +
    'the window, so a well-behaved client backs off exactly as long as it needs to and no longer.';

@Component({
    selector: 'app-message-scroller-streaming',
    standalone: true,
    imports: [
        MessageScrollerComponent,
        MessageScrollerViewportComponent,
        MessageScrollerContentComponent,
        MessageScrollerButtonComponent,
        MessageScrollerItemDirective,
        MessageComponent,
        MessageAvatarComponent,
        MessageContentComponent,
        BubbleComponent,
        MarkerComponent
    ],
    templateUrl: './message-scroller-streaming.component.html'
})
export class MessageScrollerStreamingComponent implements OnDestroy {
    atBottom = true;
    streaming = false;
    turns: Turn[] = this.initialTurns();

    private words: string[] = [];
    private cursor = 0;
    private timer?: ReturnType<typeof setInterval>;

    stream(): void {
        if (this.streaming) return;

        this.words = REPLY.split(' ');
        this.cursor = 0;
        this.streaming = true;
        this.turns = [...this.turns, { id: this.turns.length + 1, align: 'start', text: '', startsTurn: false }];

        this.timer = setInterval(() => {
            if (this.cursor >= this.words.length) {
                this.stop();
                return;
            }

            const next = this.words[this.cursor++];
            const last = this.turns[this.turns.length - 1];
            // Replace the last turn so change detection sees a new reference.
            this.turns = [
                ...this.turns.slice(0, -1),
                { ...last, text: last.text ? `${last.text} ${next}` : next }
            ];
        }, 90);
    }

    stop(): void {
        this.streaming = false;
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    reset(): void {
        this.stop();
        this.turns = this.initialTurns();
    }

    ngOnDestroy(): void {
        this.stop();
    }

    private initialTurns(): Turn[] {
        return [
            { id: 1, align: 'end', text: 'How does the rate limiter decide who to throttle?', startsTurn: true }
        ];
    }
}
