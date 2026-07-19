import { Component } from '@angular/core';
import { PlanComponent, PlanStepComponent } from '../../../../../../tolle/src/lib/plan.component';

@Component({
    selector: 'app-basic-plan',
    standalone: true,
    imports: [PlanComponent, PlanStepComponent],
    templateUrl: './basic-plan.component.html'
})
export class BasicPlanComponent { }
