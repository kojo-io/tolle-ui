import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-label',
  styles: [':host { display: inline-flex; }'],
    standalone: true,
    imports: [CommonModule],
    template: `
    <label
      [attr.for]="for"
      [class]="computedClass"
    >
      <ng-content></ng-content>
    </label>
  `
})
export class LabelComponent {
    @Input() for?: string;
    @Input() class: string = '';

    get computedClass() {
        return cn(
            "inline-flex items-center gap-2 select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            this.class
        );
    }
}
