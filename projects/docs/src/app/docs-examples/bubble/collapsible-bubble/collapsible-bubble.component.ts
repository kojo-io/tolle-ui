import { Component } from '@angular/core';
import { BubbleComponent } from '../../../../../../tolle/src/lib/bubble.component';

@Component({
    selector: 'app-collapsible-bubble',
    standalone: true,
    imports: [BubbleComponent],
    templateUrl: './collapsible-bubble.component.html'
})
export class CollapsibleBubbleComponent {
    collapsed = true;
    opened = 0;
}
