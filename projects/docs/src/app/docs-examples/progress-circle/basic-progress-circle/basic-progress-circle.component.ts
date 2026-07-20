import { Component } from '@angular/core';
import { ProgressCircleComponent } from '../../../../../../tolle/src/lib/progress-circle.component';

@Component({
    selector: 'app-basic-progress-circle',
    standalone: true,
    imports: [ProgressCircleComponent],
    templateUrl: './basic-progress-circle.component.html'
})
export class BasicProgressCircleComponent {
    value = 68;
}
