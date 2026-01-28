import { Component, inject, input, computed } from '@angular/core';

import { ToastService, ToastPosition } from './toast.service';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-toaster',
  standalone: true,
  imports: [],
  template: `
    <div [class]="cn('fixed z-[100] flex flex-col gap-2 w-full max-w-[380px] p-4', positionClasses())">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          (mouseenter)="toastService.setPaused(toast.id, true)"
          (mouseleave)="toastService.setPaused(toast.id, false)"
          [class]="cn(
            'relative overflow-hidden p-4 rounded-md border shadow-lg flex items-start justify-between gap-4 transition-all duration-300',
            getVariantClasses(toast.variant)
          )"
        >
          <div class="flex gap-3">
            @if (toast.variant && icons[toast.variant]) {
              <i [class]="cn('text-lg', icons[toast.variant])"></i>
            }
            <div class="grid gap-1">
              @if (toast.title) {
                <div class="text-sm font-semibold leading-none">{{ toast.title }}</div>
              }
              <div class="text-xs opacity-90 leading-relaxed">{{ toast.description }}</div>
            </div>
          </div>
          <button (click)="toastService.remove(toast.id)" class="opacity-50 hover:opacity-100 transition-opacity">
            <i class="ri-close-line text-lg"></i>
          </button>
          <div
            class="absolute bottom-0 left-0 h-1 transition-all duration-100 ease-linear"
            [style.width.%]="(toast.remainingTime / (toast.duration || 3000)) * 100"
            [class]="getProgressClasses(toast.variant)"
          ></div>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
  position = input<ToastPosition>('bottom-right');

  icons = {
    destructive: 'ri-error-warning-line text-destructive dark:text-red-400',
    success: 'ri-checkbox-circle-line text-emerald-600 dark:text-emerald-400',
    default: 'ri-information-line text-primary'
  } as const;

  getVariantClasses(variant: string = 'default') {
    switch (variant) {
      case 'destructive':
        return 'border-destructive/50 bg-destructive/5 dark:bg-destructive/10 text-destructive dark:text-red-400';
      case 'success':
        return 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
      default:
        return 'bg-background text-foreground border-border';
    }
  }

  getProgressClasses(variant: string = 'default') {
    switch (variant) {
      case 'destructive':
        return 'bg-destructive dark:bg-red-400';
      case 'success':
        return 'bg-emerald-600 dark:bg-emerald-400';
      default:
        return 'bg-primary';
    }
  }

  positionClasses = computed(() => {
    const pos: Record<ToastPosition, string> = {
      'top-right': 'top-0 right-0 flex-col-reverse',
      'top-left': 'top-0 left-0 flex-col-reverse',
      'bottom-right': 'bottom-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'top-center': 'top-0 left-1/2 -translate-x-1/2 flex-col-reverse',
      'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2'
    };
    return pos[this.position() as ToastPosition];
  });

  protected cn = cn;
}
