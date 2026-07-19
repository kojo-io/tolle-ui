import { Component } from '@angular/core';
import {
    ReasoningComponent,
    ReasoningTriggerComponent,
    ReasoningContentComponent
} from '../../../../../../tolle/src/lib/reasoning.component';

@Component({
    selector: 'app-basic-reasoning',
    standalone: true,
    imports: [ReasoningComponent, ReasoningTriggerComponent, ReasoningContentComponent],
    templateUrl: './basic-reasoning.component.html'
})
export class BasicReasoningComponent {
    trace = `The user is asking which spacing token to use for the toolbar.

Checked the theme: the toolbar sits inside a card that already uses p-2, so a nested p-4 would double the optical padding. The gap between the tool buttons should stay at gap-1 to keep the cluster reading as one control.

Going with p-2 on the toolbar and gap-1 inside the tool row.`;
}
