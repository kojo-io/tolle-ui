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
        class="h-full w-full rounded-[inherit] overflow-auto scrollbar-hide select-none"
        [class.overflow-x-hidden]="orientation() === 'vertical'"
        [class.overflow-y-hidden]="orientation() === 'horizontal'"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    
    .scrollbar-hide::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    .scrollbar-hide::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .scrollbar-hide::-webkit-scrollbar-thumb {
      background: #e5e5e5; /* neutral-200 */
      border-radius: 10px;
    }
    
    :host-context(.dark) .scrollbar-hide::-webkit-scrollbar-thumb {
      background: #262626; /* neutral-800 */
    }

    .scrollbar-hide::-webkit-scrollbar-thumb:hover {
      background: #d4d4d4; /* neutral-300 */
    }

    :host-context(.dark) .scrollbar-hide::-webkit-scrollbar-thumb:hover {
      background: #404040; /* neutral-700 */
    }
  `]
})
export class ScrollAreaComponent {
  class = input<string>('');
  height = input<string>('100%');
  orientation = input<'vertical' | 'horizontal' | 'both'>('both');

  protected cn = cn;
}
