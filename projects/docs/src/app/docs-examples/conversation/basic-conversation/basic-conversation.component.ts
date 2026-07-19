import { Component } from '@angular/core';
import {
    ConversationComponent,
    ConversationContentComponent,
    ConversationScrollButtonComponent
} from '../../../../../../tolle/src/lib/conversation.component';
import {
    MessageComponent,
    MessageAvatarComponent,
    MessageContentComponent,
    MessageAlign
} from '../../../../../../tolle/src/lib/message.component';
import { BubbleComponent } from '../../../../../../tolle/src/lib/bubble.component';

interface Turn {
    align: MessageAlign;
    text: string;
}

@Component({
    selector: 'app-basic-conversation',
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
    templateUrl: './basic-conversation.component.html'
})
export class BasicConversationComponent {
    turns: Turn[] = [
        { align: 'start', text: 'Morning — is the staging deploy still stuck?' },
        { align: 'end', text: 'It cleared about ten minutes ago.' },
        { align: 'start', text: 'What was it in the end?' },
        { align: 'end', text: 'A stale lock file on the build runner. I purged it and re-queued the job.' },
        { align: 'start', text: 'Does that need a follow-up so it stops happening?' },
        { align: 'end', text: 'Already filed. The cleanup step now runs even when the build fails.' },
        { align: 'start', text: 'Great. Scroll up here and the jump button appears.' }
    ];
}
