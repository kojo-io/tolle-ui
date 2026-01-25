import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-separator',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div
      [class]="computedClass"
      role="separator"
      [attr.aria-orientation]="orientation"
    ></div>
  `
})
export class SeparatorComponent {
    @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
    @Input() decorative: boolean = true;
    @Input() class: string = '';

    get computedClass() {
        return cn(
            "shrink-0 bg-neutral-200 dark:bg-neutral-800",
            this.orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
            this.class
        );
    }
}
