import { Component, Input } from '@angular/core';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-select-separator',
  styles: [':host { display: block; }'],
  standalone: true,
  template: `
    <div role="separator" aria-hidden="true" [class]="cn('-mx-1 my-1 h-px bg-border', class)"></div>
  `,
})
export class SelectSeparatorComponent {
  @Input() class = '';
  protected cn = cn;
}
