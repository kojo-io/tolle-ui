import { Component } from '@angular/core';
import { MarkerComponent } from '../../../../../../tolle/src/lib/marker.component';
import {
    MessageComponent,
    MessageAvatarComponent,
    MessageContentComponent
} from '../../../../../../tolle/src/lib/message.component';
import { BubbleComponent } from '../../../../../../tolle/src/lib/bubble.component';

@Component({
    selector: 'app-marker-in-transcript',
    standalone: true,
    imports: [
        MarkerComponent,
        MessageComponent,
        MessageAvatarComponent,
        MessageContentComponent,
        BubbleComponent
    ],
    templateUrl: './marker-in-transcript.component.html'
})
export class MarkerInTranscriptComponent { }
