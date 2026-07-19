import { Component } from '@angular/core';
import { BubbleComponent } from '../../../../../../tolle/src/lib/bubble.component';

@Component({
    selector: 'app-basic-bubble',
    standalone: true,
    imports: [BubbleComponent],
    templateUrl: './basic-bubble.component.html'
})
export class BasicBubbleComponent { }
