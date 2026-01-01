import { Component, Input } from '@angular/core';
import { cn } from "./utils/cn";
import { NgIf } from '@angular/common';

@Component({
  selector: 'tolle-otp-slot',
  standalone: true,
  imports: [NgIf],
  template: `
    <div [class]="computedClass">
      <span class="text-lg font-medium">{{ char || '' }}</span>
      <div *ngIf="isActive && !char" class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div class="h-6 w-0.5 animate-caret-blink bg-foreground"></div>
      </div>
    </div>
  `
})
export class OtpSlotComponent {
  @Input() char: string | undefined = '';
  @Input() isActive: boolean = false;
  @Input() isFirst: boolean = false;
  @Input() isLast: boolean = false;
  @Input() class: string = '';
  protected cn = cn;

  get computedClass() {
    return cn(
      // Base styles (matching input container)
      'relative flex h-10 w-10 items-center justify-center',
      'transition-all duration-200',
      'text-center font-medium select-none',

      // Border styling - exactly like input
      'border border-input shadow-sm bg-background',

      // FOCUS STYLING - EXACTLY LIKE INPUT COMPONENT
      this.isActive && [
        // Darker border on focus
        'border-primary/80',
        // Remove shadow on focus
        'shadow-none',
        // Focus ring with same styling as input
        'ring-4',
        'ring-ring/30',
        'ring-offset-0',
        // Ensure it's above other slots
        'z-10'
      ],

      // Filled state
      this.char && !this.isActive && 'border-primary/60',

      // Border radius
      this.isFirst && 'rounded-l-md',
      this.isLast && 'rounded-r-md',

      // Remove left border for all but first slot
      !this.isFirst && '-ml-px',

      this.class
    );
  }
}
