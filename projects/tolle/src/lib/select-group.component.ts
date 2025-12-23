import { Component, Input } from '@angular/core';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-select-group',
  standalone: true,
  template: `
    <div [class]="cn('px-2 py-1.5 text-sm font-semibold text-muted-foreground', class)">
      <ng-content></ng-content>
    </div>
  `,
})
export class SelectGroupComponent {
  @Input() class = '';
  protected cn = cn;
}
