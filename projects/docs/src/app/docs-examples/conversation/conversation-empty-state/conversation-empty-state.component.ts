import { Component } from '@angular/core';
import {
    ConversationComponent,
    ConversationContentComponent,
    ConversationEmptyStateComponent,
    ConversationScrollButtonComponent
} from '../../../../../../tolle/src/lib/conversation.component';
import {
    MessageComponent,
    MessageAvatarComponent,
    MessageContentComponent
} from '../../../../../../tolle/src/lib/message.component';
import { BubbleComponent } from '../../../../../../tolle/src/lib/bubble.component';

@Component({
    selector: 'app-conversation-empty-state',
    standalone: true,
    imports: [
        ConversationComponent,
        ConversationContentComponent,
        ConversationEmptyStateComponent,
        ConversationScrollButtonComponent,
        MessageComponent,
        MessageAvatarComponent,
        MessageContentComponent,
        BubbleComponent
    ],
    templateUrl: './conversation-empty-state.component.html'
})
export class ConversationEmptyStateExampleComponent {
    messages: string[] = [];

    send(): void {
        this.messages = [...this.messages, `Message ${this.messages.length + 1}`];
    }

    clear(): void {
        this.messages = [];
    }
}
