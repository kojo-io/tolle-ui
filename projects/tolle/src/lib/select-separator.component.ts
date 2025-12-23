import { Component, Input } from '@angular/core';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-select-separator',
  standalone: true,
  template: `
    <div [class]="cn('-mx-1 my-1 h-px bg-border', class)"></div>
  `,
})
export class SelectSeparatorComponent {
  @Input() class = '';
  protected cn = cn;
}
