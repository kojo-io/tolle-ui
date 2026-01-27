import { Component, input, output, computed } from '@angular/core';

import { cn } from './utils/cn';

@Component({
  selector: 'tolle-badge',
  standalone: true,
  imports: [],
  template: `
    <div [class]="computedClass()">
      <ng-content select="[prefix]"></ng-content>
    
      <span class="truncate">
        <ng-content></ng-content>
      </span>
    
      @if (removable()) {
        <button
          (click)="onRemove.emit($event)"
          class="ml-1 -mr-1 rounded-md hover:bg-foreground/20 transition-colors outline-none">
          <i class="ri-close-line"></i>
        </button>
      }
    </div>
    `
})
export class BadgeComponent {
  variant = input<'default' | 'secondary' | 'outline' | 'destructive'>('default');
  size = input<'xs' | 'sm' | 'default'>('default');
  removable = input(false); // Toggle the "Pill" remove icon
  class = input('');

  onRemove = output<MouseEvent>();

  protected readonly cn = cn;

  computedClass = computed(() => {
    return cn(
      // Base styles - Pills are always rounded-full
      'flex items-center justify-center rounded-md border px-2 py-0.5 font-medium transition-colors gap-1',

      // Variants (Google Dark Mode theme)
      this.variant() === 'default' && 'border-transparent bg-primary text-primary-foreground',
      this.variant() === 'secondary' && 'border-transparent bg-secondary text-secondary-foreground',
      this.variant() === 'outline' && 'text-foreground border-border bg-transparent',
      this.variant() === 'destructive' && 'border-transparent bg-destructive text-destructive-foreground',

      // Sizing
      this.size() === 'xs' && 'px-1.5 py-0 text-[10px]',
      this.size() === 'sm' && 'px-2 py-0 text-[11px]',
      this.size() === 'default' && 'text-xs',

      this.class()
    );
  });
}
