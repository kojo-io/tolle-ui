import { Component, input, output, signal } from '@angular/core';

import { trigger, transition, style, animate } from '@angular/animations';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>i+div]:translate-y-[-3px] [&>i]:absolute [&>i]:left-4 [&>i]:top-4 [&>i]:text-foreground [&>i~div]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-red-500/50 text-red-500 dark:border-red-500 [&>i]:text-red-500",
        success:
          "border-emerald-500/50 text-emerald-700 dark:border-emerald-500 [&>i]:text-emerald-600 dark:text-emerald-400",
        warning:
          "border-amber-500/50 text-amber-700 dark:border-amber-500 [&>i]:text-amber-600 dark:text-amber-400",
        info:
          "border-blue-500/50 text-blue-700 dark:border-blue-500 [&>i]:text-blue-600 dark:text-blue-400",
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
  imports: [],
  animations: [
    trigger('fade', [
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'scale(0.95)', height: 0, margin: 0, padding: 0 }))
      ])
    ])
  ],
  template: `
    @if (!dismissed()) {
      <div
        @fade
        [class]="cn(alertVariants({ variant: variant() }), className())"
        role="alert"
        >
        <ng-content select="[icon]"></ng-content>
        @if (dismissible()) {
          <button
            (click)="dismiss()"
            class="absolute right-2 top-2 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            type="button"
            >
            <i class="ri-close-line text-lg"></i>
            <span class="sr-only">Close</span>
          </button>
        }
        <div>
          @if (title()) {
            <h5 class="mb-1 font-medium leading-none tracking-tight">
              {{ title() }}
            </h5>
          }
          <div class="text-sm [&_p]:leading-relaxed opacity-90">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
    `
})
export class AlertComponent {
  variant = input<AlertVariants['variant']>('default');
  title = input<string | undefined>();
  className = input('', { alias: 'class' });
  dismissible = input<boolean>(false);

  onClose = output<void>();

  dismissed = signal(false);
  protected alertVariants = alertVariants;
  protected cn = cn;

  dismiss() {
    this.dismissed.set(true);
    this.onClose.emit();
  }
}
