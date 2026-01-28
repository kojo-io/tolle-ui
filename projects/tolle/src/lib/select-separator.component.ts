import { Component, input } from '@angular/core';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-select-separator',
  standalone: true,
  template: `
    <div [class]="cn('-mx-1 my-1 h-px bg-border', className())"></div>
  `,
})
export class SelectSeparatorComponent {
  className = input('', { alias: 'class' });
  protected cn = cn;
}
