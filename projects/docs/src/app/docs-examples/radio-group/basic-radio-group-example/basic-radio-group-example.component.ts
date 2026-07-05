import { Component } from '@angular/core';
import { RadioGroupComponent } from '../../../../../../tolle/src/lib/radio-group.component';
import { RadioItemComponent } from '../../../../../../tolle/src/lib/radio-item.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-basic-radio-group-example',
    imports: [
        RadioGroupComponent,
        RadioItemComponent,
        FormsModule,
        JsonPipe
    ],
    template: `
    <div class="flex flex-col gap-4">
      <tolle-radio-group [(ngModel)]="selectedPlan">
        <tolle-radio-item value="free">Free Plan</tolle-radio-item>
        <tolle-radio-item value="pro">Pro Plan</tolle-radio-item>
        <tolle-radio-item value="enterprise">Enterprise Plan</tolle-radio-item>
      </tolle-radio-group>
      
      <div class="text-sm text-muted-foreground">
        Selected: {{ selectedPlan | json }}
      </div>
    </div>
  `
})
export class BasicRadioGroupExampleComponent {
    selectedPlan = 'free';
}
