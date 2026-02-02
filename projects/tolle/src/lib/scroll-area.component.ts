import { Component, input } from '@angular/core';

import { cn } from './utils/cn';

@Component({
  selector: 'tolle-scroll-area',
  standalone: true,
  imports: [],
  template: `
    <div 
      [class]="cn('relative overflow-hidden', class())"
      [style.height]="height()"
    >
      <div 
        class="h-full w-full rounded-[inherit] overflow-auto select-none"
        [class.overflow-x-hidden]="orientation() === 'vertical'"
        [class.overflow-y-hidden]="orientation() === 'horizontal'"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ScrollAreaComponent {
  class = input<string>('');
  height = input<string>('100%');
  orientation = input<'vertical' | 'horizontal' | 'both'>('both');

  protected cn = cn;
}
