import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-separator',
  styles: [':host { display: block; }'],
    standalone: true,
    imports: [CommonModule],
    template: `
    <div
      [class]="computedClass"
      [attr.role]="decorative ? 'none' : 'separator'"
      [attr.aria-hidden]="decorative ? 'true' : null"
      [attr.aria-orientation]="!decorative && orientation === 'vertical' ? 'vertical' : null"
      [attr.data-orientation]="orientation"
    ></div>
  `
})
export class SeparatorComponent {
    /** Orientation of the rule. @default 'horizontal' */
    @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
    /** When true, the separator is purely visual (aria-hidden, role="none"). @default true */
    @Input() decorative: boolean = true;
    @Input() class: string = '';

    get computedClass() {
        return cn(
            "shrink-0 bg-border",
            this.orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
            this.class
        );
    }
}
