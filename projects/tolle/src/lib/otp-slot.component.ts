import { Component, input, computed } from '@angular/core';
import { cn } from "./utils/cn";

@Component({
  selector: 'tolle-otp-slot',
  standalone: true,
  imports: [],
  template: `
    <div [class]="computedClass()">
      <span class="text-lg font-medium">{{ char() || '' }}</span>
      @if (isActive() && !char()) {
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div class="h-6 w-0.5 animate-caret-blink bg-foreground"></div>
        </div>
      }
    </div>
  `
})
export class OtpSlotComponent {
  char = input<string | undefined>('');
  isActive = input<boolean>(false);
  isFirst = input<boolean>(false);
  isLast = input<boolean>(false);
  class = input<string>('');

  computedClass = computed(() => {
    return cn(
      'relative flex h-10 w-10 items-center justify-center',
      'transition-all duration-200',
      'text-center font-medium select-none',
      'border border-input shadow-sm bg-background',
      this.isActive() && [
        'border-primary/80',
        'shadow-none',
        'ring-4',
        'ring-ring/30',
        'ring-offset-0',
        'z-10'
      ],
      this.char() && !this.isActive() && 'border-primary/60',
      this.isFirst() && 'rounded-l-md',
      this.isLast() && 'rounded-r-md',
      !this.isFirst() && '-ml-px',
      this.class()
    );
  });

  protected cn = cn;
}
