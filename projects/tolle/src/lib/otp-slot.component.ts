import { Component, Input } from '@angular/core';
import { cn } from "./utils/cn";
import { NgIf } from '@angular/common';

@Component({
  selector: 'tolle-otp-slot',
  standalone: true,
  imports: [NgIf],
  template: `
    <div [class]="cn(
      'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all',
      'bg-background',
      isFirst ? 'rounded-l-md border-l' : '',
      isLast ? 'rounded-r-md' : '',
      isActive ? 'z-10 ring-2 ring-ring ring-offset-background' : '',
      class
    )">
      {{ char || '' }}
      <div *ngIf="isActive && !char" class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div class="h-4 w-px animate-caret-blink bg-foreground duration-1000"></div>
      </div>
    </div>
  `
})
export class OtpSlotComponent {
  @Input() char: string | undefined = '';
  @Input() isActive: boolean = false;
  @Input() isFirst: boolean = false; // New Input
  @Input() isLast: boolean = false;  // New Input
  @Input() class: string = '';
  protected cn = cn;
}
