import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderComponent } from '../../../../../../tolle/src/lib/slider.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';

@Component({
  selector: 'app-basic-slider',
  imports: [FormsModule, SliderComponent, LabelComponent],
  template: `
    <div class="grid w-full max-w-sm gap-3">
      <div class="flex items-center justify-between">
        <tolle-label>Volume</tolle-label>
        <span class="text-sm text-muted-foreground">{{ volume }}%</span>
      </div>
      <!-- The value is a number bound with ngModel / formControlName. -->
      <tolle-slider [(ngModel)]="volume" [min]="0" [max]="100" [step]="5"></tolle-slider>
    </div>
  `,
})
export class BasicSliderComponent {
  volume = 40;
}
