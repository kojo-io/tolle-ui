import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-label',
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
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            this.class
        );
    }
}
