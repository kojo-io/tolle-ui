import { Component } from '@angular/core';
import { ToggleComponent } from '../../../../../../tolle/src/lib/toggle.component';

@Component({
  selector: 'app-basic-toggle',
  imports: [ToggleComponent],
  template: `
    <div class="flex items-center gap-2">
      <!-- [(pressed)] for local state; [(ngModel)] / formControlName also work. -->
      <tolle-toggle [(pressed)]="bold" aria-label="Toggle bold">
        <i class="ri-bold"></i>
      </tolle-toggle>
      <tolle-toggle variant="outline" [(pressed)]="italic" aria-label="Toggle italic">
        <i class="ri-italic"></i>
      </tolle-toggle>
    </div>
    <p class="mt-3 text-sm text-muted-foreground">Bold: {{ bold }} · Italic: {{ italic }}</p>
  `,
})
export class BasicToggleComponent {
  bold = false;
  italic = true;
}
