import { Component } from '@angular/core';
import { PlanComponent, PlanStepComponent } from '../../../../../../tolle/src/lib/plan.component';

@Component({
    selector: 'app-plan-collapsed',
    standalone: true,
    imports: [PlanComponent, PlanStepComponent],
    templateUrl: './plan-collapsed.component.html'
})
export class PlanCollapsedComponent {
  collapsed = true;
}
