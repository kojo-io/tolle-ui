import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>i+div]:translate-y-[-3px] [&>i]:absolute [&>i]:left-4 [&>i]:top-4 [&>i]:text-foreground [&>i~div]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive [&>i]:text-destructive",
        success: "border-success/50 text-success [&>i]:text-success",
        warning: "border-warning/50 text-warning [&>i]:text-warning",
        info: "border-info/50 text-info [&>i]:text-info",
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
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fade', [
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'scale(0.95)', height: 0, margin: 0, padding: 0 }))
      ])
    ])
  ],
  template: `
    <div
      *ngIf="!dismissed"
      @fade
      [class]="cn(alertVariants({ variant }), class)"
      role="alert"
    >
      <ng-content select="[icon]"></ng-content>

      <button
        *ngIf="dismissible"
        (click)="dismiss()"
        class="absolute right-2 top-2 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        type="button"
      >
        <i class="ri-close-line text-lg"></i>
        <span class="sr-only">Close</span>
      </button>

      <div>
        <h5 *ngIf="title" class="mb-1 font-medium leading-none tracking-tight">
          {{ title }}
        </h5>
        <div class="text-sm [&_p]:leading-relaxed opacity-90">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class AlertComponent {
  @Input() variant: AlertVariants['variant'] = 'default';
  @Input() title?: string;
  @Input() class: string = '';
  @Input() dismissible: boolean = false;

  @Output() onClose = new EventEmitter<void>();

  dismissed = false;
  protected alertVariants = alertVariants;
  protected cn = cn;

  dismiss() {
    this.dismissed = true;
    this.onClose.emit();
  }
}
