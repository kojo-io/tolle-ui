import { Component } from '@angular/core';
import {
    MessageComponent,
    MessageAvatarComponent,
    MessageContentComponent
} from '../../../../../../tolle/src/lib/message.component';
import { BubbleComponent } from '../../../../../../tolle/src/lib/bubble.component';

@Component({
    selector: 'app-basic-message',
    standalone: true,
    imports: [MessageComponent, MessageAvatarComponent, MessageContentComponent, BubbleComponent],
    templateUrl: './basic-message.component.html'
})
export class BasicMessageComponent { }
