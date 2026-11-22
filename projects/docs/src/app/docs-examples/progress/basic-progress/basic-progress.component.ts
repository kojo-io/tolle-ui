import { Component } from '@angular/core';
import { ProgressComponent } from '../../../../../../tolle/src/lib/progress.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
  selector: 'app-basic-progress',
  imports: [ProgressComponent, ButtonComponent],
  template: `
    <div class="grid w-full max-w-sm gap-3">
      <!-- value is 0–100. -->
      <tolle-progress [value]="progress"></tolle-progress>
      <div class="flex items-center gap-2">
        <tolle-button size="sm" variant="outline" (click)="progress = Math.max(0, progress - 10)">-10</tolle-button>
        <tolle-button size="sm" variant="outline" (click)="progress = Math.min(100, progress + 10)">+10</tolle-button>
        <span class="text-sm text-muted-foreground">{{ progress }}%</span>
      </div>
    </div>
  `,
})
export class BasicProgressComponent {
  progress = 60;
  protected readonly Math = Math;
}
