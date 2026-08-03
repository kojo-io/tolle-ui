import { Component } from '@angular/core';
import {
    MessageComponent,
    MessageAvatarComponent,
    MessageContentComponent,
    MessageHeaderComponent,
    MessageFooterComponent
} from '../../../../../../tolle/src/lib/message.component';
import { BubbleComponent } from '../../../../../../tolle/src/lib/bubble.component';

@Component({
    selector: 'app-message-header-footer',
    imports: [
        MessageComponent,
        MessageAvatarComponent,
        MessageContentComponent,
        MessageHeaderComponent,
        MessageFooterComponent,
        BubbleComponent
    ],
    templateUrl: './message-header-footer.component.html'
})
export class MessageHeaderFooterComponent { }
