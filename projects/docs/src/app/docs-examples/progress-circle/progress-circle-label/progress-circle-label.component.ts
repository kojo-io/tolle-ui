import { Component } from '@angular/core';
import { ProgressCircleComponent } from '../../../../../../tolle/src/lib/progress-circle.component';

@Component({
    selector: 'app-progress-circle-label',
    standalone: true,
    imports: [ProgressCircleComponent],
    templateUrl: './progress-circle-label.component.html'
})
export class ProgressCircleLabelComponent {
    value = 82;
}
