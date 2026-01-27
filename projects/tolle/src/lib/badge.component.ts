import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-badge',
    imports: [CommonModule],
    template: `
    <div [class]="computedClass">
      <ng-content select="[prefix]"></ng-content>

      <span class="truncate">
        <ng-content></ng-content>
      </span>

      <button
        *ngIf="removable"
        (click)="onRemove.emit($event)"
        class="ml-1 -mr-1 rounded-md hover:bg-foreground/20 transition-colors outline-none">
        <i class="ri-close-line"></i>
      </button>
    </div>
  `
})
export class BadgeComponent {
  @Input() variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'default';
  @Input() size: 'xs' | 'sm' | 'default' = 'default';
  @Input() removable = false; // Toggle the "Pill" remove icon
  @Input() class = '';

  @Output() onRemove = new EventEmitter<MouseEvent>();

  protected readonly cn = cn;

  get computedClass() {
    return cn(
      // Base styles - Pills are always rounded-full
      'flex items-center justify-center rounded-md border px-2 py-0.5 font-medium transition-colors gap-1',

      // Variants (Google Dark Mode theme)
      this.variant === 'default' && 'border-transparent bg-primary text-primary-foreground',
      this.variant === 'secondary' && 'border-transparent bg-secondary text-secondary-foreground',
      this.variant === 'outline' && 'text-foreground border-border bg-transparent',
      this.variant === 'destructive' && 'border-transparent bg-destructive text-destructive-foreground',

      // Sizing
      this.size === 'xs' && 'px-1.5 py-0 text-[10px]',
      this.size === 'sm' && 'px-2 py-0 text-[11px]',
      this.size === 'default' && 'text-xs',

      this.class
    );
  }
}
