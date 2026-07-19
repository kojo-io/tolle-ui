import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShimmerComponent } from '../../../../../../tolle/src/lib/shimmer.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-shimmer-settled',
    standalone: true,
    imports: [CommonModule, ShimmerComponent, ButtonComponent],
    templateUrl: './shimmer-settled.component.html'
})
export class ShimmerSettledComponent {
    streaming = true;

    get label(): string {
        return this.streaming ? 'Generating response…' : 'Generated response';
    }

    toggle(): void {
        this.streaming = !this.streaming;
    }
}
