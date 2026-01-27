import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-progress',
    imports: [CommonModule],
    template: `
    <div
      [class]="computedClass"
      role="progressbar"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="100"
      [attr.aria-valuenow]="value"
    >
      <div
        class="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
        [style.transform]="'translateX(-' + (100 - (value || 0)) + '%)'"
      ></div>
    </div>
  `
})
export class ProgressComponent {
    @Input() value: number | null = 0;
    @Input() class: string = '';

    get computedClass() {
        return cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
            this.class
        );
    }
}
