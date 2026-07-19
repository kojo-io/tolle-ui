import { Component } from '@angular/core';
import {
    MessageComponent,
    MessageGroupComponent,
    MessageAvatarComponent,
    MessageContentComponent,
    MessageHeaderComponent
} from '../../../../../../tolle/src/lib/message.component';
import { BubbleComponent } from '../../../../../../tolle/src/lib/bubble.component';

@Component({
    selector: 'app-message-group',
    standalone: true,
    imports: [
        MessageComponent,
        MessageGroupComponent,
        MessageAvatarComponent,
        MessageContentComponent,
        MessageHeaderComponent,
        BubbleComponent
    ],
    templateUrl: './message-group.component.html'
})
export class MessageGroupExampleComponent { }
