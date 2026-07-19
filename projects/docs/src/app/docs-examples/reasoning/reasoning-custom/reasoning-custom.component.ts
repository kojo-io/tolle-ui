import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReasoningComponent,
    ReasoningTriggerComponent,
    ReasoningContentComponent
} from '../../../../../../tolle/src/lib/reasoning.component';

@Component({
    selector: 'app-reasoning-custom',
    standalone: true,
    imports: [CommonModule, ReasoningComponent, ReasoningTriggerComponent, ReasoningContentComponent],
    templateUrl: './reasoning-custom.component.html'
})
export class ReasoningCustomComponent {
    open = false;

    onOpenChange(open: boolean): void {
        this.open = open;
    }
}
