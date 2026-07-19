import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ChainOfThoughtComponent,
    ChainOfThoughtHeaderComponent,
    ChainOfThoughtContentComponent,
    ChainOfThoughtStepComponent,
    ChainOfThoughtStepStatus
} from '../../../../../../tolle/src/lib/chain-of-thought.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

interface Step {
    label: string;
    icon: string;
}

@Component({
    selector: 'app-chain-of-thought-progress',
    standalone: true,
    imports: [
        CommonModule,
        ChainOfThoughtComponent,
        ChainOfThoughtHeaderComponent,
        ChainOfThoughtContentComponent,
        ChainOfThoughtStepComponent,
        ButtonComponent
    ],
    templateUrl: './chain-of-thought-progress.component.html'
})
export class ChainOfThoughtProgressComponent {
    readonly steps: Step[] = [
        { label: 'Parsed the question', icon: 'ri-chat-1-line' },
        { label: 'Queried the pricing table', icon: 'ri-database-2-line' },
        { label: 'Ran the projection', icon: 'ri-line-chart-line' },
        { label: 'Drafted the summary', icon: 'ri-quill-pen-line' }
    ];

    /** Index of the step currently running; steps before it are complete. */
    current = 1;

    get done(): boolean {
        return this.current >= this.steps.length;
    }

    get headerLabel(): string {
        return this.done ? 'Thought for 9 seconds' : this.steps[this.current].label + '…';
    }

    statusFor(index: number): ChainOfThoughtStepStatus {
        if (index < this.current) return 'complete';
        if (index === this.current) return 'active';
        return 'pending';
    }

    advance(): void {
        this.current = this.done ? 0 : this.current + 1;
    }
}
