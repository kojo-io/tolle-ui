import { Component } from '@angular/core';
import {
    MessageScrollerComponent,
    MessageScrollerViewportComponent,
    MessageScrollerContentComponent,
    MessageScrollerButtonComponent,
    MessageScrollerItemDirective
} from '../../../../../../tolle/src/lib/message-scroller.component';
import { ScrollStartPosition } from '../../../../../../tolle/src/lib/message-scroller.service';
import {
    MessageComponent,
    MessageAvatarComponent,
    MessageContentComponent,
    MessageHeaderComponent,
    MessageAlign
} from '../../../../../../tolle/src/lib/message.component';
import { BubbleComponent } from '../../../../../../tolle/src/lib/bubble.component';

interface Turn {
    id: number;
    align: MessageAlign;
    text: string;
    startsTurn: boolean;
}

@Component({
    selector: 'app-message-scroller-start-position',
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
        MessageHeaderComponent,
        BubbleComponent
    ],
    templateUrl: './message-scroller-start-position.component.html'
})
export class MessageScrollerStartPositionComponent {
    options: ScrollStartPosition[] = ['top', 'bottom', 'last-anchor'];
    startPosition: ScrollStartPosition = 'last-anchor';
    peek = 48;

    turns: Turn[] = [
        { id: 1, align: 'end', text: 'Summarise the incident from last night.', startsTurn: true },
        { id: 2, align: 'start', text: 'The queue backed up at 02:10 after a bad config push.', startsTurn: false },
        { id: 3, align: 'end', text: 'And the customer impact?', startsTurn: true },
        { id: 4, align: 'start', text: 'About 900 delayed webhooks, all delivered by 02:55. No data was lost.', startsTurn: false },
        { id: 5, align: 'end', text: 'Write the postmortem opening.', startsTurn: true },
        {
            id: 6,
            align: 'start',
            text: 'At 02:10 UTC a configuration change reduced the webhook worker pool from twelve to two, which was enough to stall delivery without failing any health check. The backlog grew for forty minutes before an alert fired on queue age rather than on error rate — the signal that would have caught it sooner. Rolling the config back drained the queue in under fifteen minutes, and every delayed webhook was delivered.',
            startsTurn: false
        }
    ];

    setPeek(event: Event): void {
        this.peek = Number((event.target as HTMLInputElement).value);
    }
}
