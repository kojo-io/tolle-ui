import {
  Component,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-popover-content',
    imports: [CommonModule],
    template: `
    <div
      [class]="cn(
        'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
        'animate-in fade-in zoom-in-95 duration-200',
        class
      )"
      role="dialog"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class PopoverContentComponent {
  @Input() class = '';
  protected cn = cn;
}
