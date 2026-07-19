import { Component } from '@angular/core';
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

interface Turn {
    id: number;
    align: MessageAlign;
    text: string;
    startsTurn: boolean;
}

@Component({
    selector: 'app-basic-message-scroller',
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
        BubbleComponent
    ],
    templateUrl: './basic-message-scroller.component.html'
})
export class BasicMessageScrollerComponent {
    atBottom = true;

    turns: Turn[] = [
        { id: 1, align: 'end', text: 'Why does the importer drop the last row?', startsTurn: true },
        { id: 2, align: 'start', text: 'Because the reader stops at the last newline rather than at end-of-input, so a file without a trailing newline loses its final record.', startsTurn: false },
        { id: 3, align: 'end', text: 'Can we fix it without a schema change?', startsTurn: true },
        { id: 4, align: 'start', text: 'Yes — flush whatever is left in the buffer when the stream ends. It is a four-line change in the reader.', startsTurn: false },
        { id: 5, align: 'end', text: 'Do it, and add a regression test with no trailing newline.', startsTurn: true },
        { id: 6, align: 'start', text: 'Done. The test fails on the old reader and passes on the new one.', startsTurn: false }
    ];
}
