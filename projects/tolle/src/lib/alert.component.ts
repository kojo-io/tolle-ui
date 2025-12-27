import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 transition-all duration-300 [&>i~div]:pl-7 [&>i]:absolute [&>i]:left-4 [&>i]:top-4 [&>i]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>i]:text-destructive",
        success: "border-emerald-500/50 text-emerald-700 dark:text-emerald-400 [&>i]:text-emerald-600",
        warning: "border-amber-500/50 text-amber-700 dark:text-amber-400 [&>i]:text-amber-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type AlertVariants = VariantProps<typeof alertVariants>;

@Component({
  selector: 'tolle-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="!dismissed"
      [class]="cn(alertVariants({ variant }), class)"
      [class.opacity-0]="isDismissing"
      [class.scale-95]="isDismissing"
      role="alert"
    >
      <ng-content select="[icon]"></ng-content>

      <button
        *ngIf="dismissible"
        (click)="dismiss()"
        class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100"
        [class.opacity-100]="dismissible"
      >
        <i class="ri-close-line text-lg"></i>
      </button>

      <div>
        <h5 *ngIf="title" class="mb-1 font-medium leading-none tracking-tight">
          {{ title }}
        </h5>
        <div class="text-sm [&_p]:leading-relaxed">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class AlertComponent {
  @Input() variant: AlertVariants['variant'] = 'default';
  @Input() title?: string;
  @Input() class: string = '';
  @Input() dismissible: boolean = false;

  @Output() onClose = new EventEmitter<void>();

  dismissed = false;
  isDismissing = false;

  protected alertVariants = alertVariants;
  protected cn = cn;

  dismiss() {
    this.isDismissing = true;
    // Wait for animation to finish before removing from DOM
    setTimeout(() => {
      this.dismissed = true;
      this.onClose.emit();
    }, 300);
  }
}
