import { Component, OnDestroy } from '@angular/core';
import {
    ConversationComponent,
    ConversationContentComponent,
    ConversationScrollButtonComponent
} from '../../../../../../tolle/src/lib/conversation.component';
import {
    MessageComponent,
    MessageAvatarComponent,
    MessageContentComponent
} from '../../../../../../tolle/src/lib/message.component';
import { BubbleComponent } from '../../../../../../tolle/src/lib/bubble.component';

interface Turn {
    id: number;
    text: string;
}

@Component({
    selector: 'app-conversation-auto-scroll',
    standalone: true,
    imports: [
        ConversationComponent,
        ConversationContentComponent,
        ConversationScrollButtonComponent,
        MessageComponent,
        MessageAvatarComponent,
        MessageContentComponent,
        BubbleComponent
    ],
    templateUrl: './conversation-auto-scroll.component.html'
})
export class ConversationAutoScrollComponent implements OnDestroy {
    autoScroll = true;
    atBottom = true;
    running = false;
    jumps = 0;

    turns: Turn[] = [
        { id: 0, text: 'Watching the deploy queue.' },
        { id: 1, text: 'Tell me when it drains.' }
    ];

    private timer?: ReturnType<typeof setInterval>;

    start(): void {
        if (this.running) return;
        this.running = true;

        this.timer = setInterval(() => {
            const id = this.turns.length;
            this.turns = [...this.turns, { id, text: `Queue update ${id} — job ${1000 + id} finished.` }];
            if (this.turns.length > 40) this.stop();
        }, 1200);
    }

    stop(): void {
        this.running = false;
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    ngOnDestroy(): void {
        this.stop();
    }
}
