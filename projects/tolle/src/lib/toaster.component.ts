// projects/tolle/src/lib/toast-container.component.ts
import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToastService, Toast, ToastPosition} from './toast.service';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-toaster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cn('fixed z-[100] flex flex-col gap-2 w-full max-w-[380px] p-4', positionClasses)">
      <div
        *ngFor="let toast of toasts$ | async"
        (mouseenter)="toastService.setPaused(toast.id, true)"
        (mouseleave)="toastService.setPaused(toast.id, false)"
        [class]="cn(
          'relative overflow-hidden p-4 rounded-md border border-border shadow-lg flex items-start justify-between gap-4 transition-all duration-300 bg-background text-foreground',
          toast.variant === 'destructive' && 'border-destructive/50 text-destructive'
        )"
      >
        <div class="grid gap-1">
          <div *ngIf="toast.title" class="text-sm font-semibold">{{ toast.title }}</div>
          <div class="text-xs opacity-90">{{ toast.description }}</div>
        </div>

        <button (click)="toastService.remove(toast.id)" class="opacity-50 hover:opacity-100">
          <i class="ri-close-line"></i>
        </button>

        <div
          class="absolute bottom-0 left-0 h-1 transition-all duration-100 ease-linear"
          [style.width.%]="(toast.remainingTime / (toast.duration || 3000)) * 100"
          [class.bg-destructive]="toast.variant === 'destructive'"
          [class.bg-primary]="toast.variant !== 'destructive'"
        ></div>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
  @Input() position: ToastPosition = 'bottom-right';
  toasts$ = this.toastService.toasts$;
  get positionClasses() {
    const pos = {
      'top-right': 'top-0 right-0 flex-col-reverse',
      'top-left': 'top-0 left-0 flex-col-reverse',
      'bottom-right': 'bottom-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'top-center': 'top-0 left-1/2 -translate-x-1/2 flex-col-reverse',
      'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2'
    };
    return pos[this.position];
  }
  protected cn = cn;
}
