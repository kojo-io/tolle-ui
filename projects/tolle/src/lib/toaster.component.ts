// projects/tolle/src/lib/toast-container.component.ts
import { Component, ElementRef, OnDestroy, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast, ToastPosition, ToastVariant } from './toast.service';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-toaster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cn('fixed z-[10000] pointer-events-none flex flex-col gap-2 w-full max-w-[380px] p-4', positionClasses)">
      <div
        *ngFor="let toast of toasts$ | async"
        role="status"
        [attr.aria-live]="toast.variant === 'destructive' ? 'assertive' : 'polite'"
        aria-atomic="true"
        (mouseenter)="toastService.setPaused(toast.id, true)"
        (mouseleave)="toastService.setPaused(toast.id, false)"
        [class]="cn(
          'pointer-events-auto relative overflow-hidden p-4 rounded-md border shadow-lg flex items-start justify-between gap-4 transition-all duration-300',
          'bg-background text-foreground',
          getVariantClasses(toast.variant)
        )"
      >
        <!-- Opaque surface above, variant tint layered on top of it. -->
        <div aria-hidden="true" [class]="cn('absolute inset-0 pointer-events-none', getTintClasses(toast.variant))"></div>

        <div class="relative flex gap-3">
          <i *ngIf="toast.variant && icons[toast.variant]" [class]="cn('text-lg', icons[toast.variant])"></i>
          
          <div class="grid gap-1">
            <div *ngIf="toast.title" class="text-sm font-semibold leading-none">{{ toast.title }}</div>
            <div class="text-xs opacity-90 leading-relaxed">{{ toast.description }}</div>
          </div>
        </div>

        <button type="button" aria-label="Close" (click)="toastService.remove(toast.id)" class="relative opacity-50 hover:opacity-100 transition-opacity">
          <span class="sr-only">Close</span>
          <i class="ri-close-line text-lg"></i>
        </button>

        <div
          aria-hidden="true"
          class="absolute bottom-0 left-0 h-1 transition-all duration-100 ease-linear z-10"
          [style.width.%]="(toast.remainingTime / (toast.duration || 3000)) * 100"
          [class]="getProgressClasses(toast.variant)"
        ></div>
      </div>
    </div>
  `,
  styles: [':host { display: contents; }']
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toastService = inject(ToastService);
  private elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  @Input() position: ToastPosition = 'bottom-right';
  toasts$ = this.toastService.toasts$;

  /**
   * Move the host to <body> so the fixed container is never clipped or
   * z-index-clamped by a consumer ancestor that creates a stacking context
   * (transform / filter / backdrop-blur / opacity). Being a direct child of
   * <body> and sitting above the CDK overlay container keeps toasts on top
   * of modals, sheets and alert dialogs.
   */
  ngOnInit() {
    document.body.appendChild(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }

  icons: Record<ToastVariant, string> = {
    default: 'ri-information-line text-primary',
    destructive: 'ri-error-warning-line text-destructive',
    success: 'ri-checkbox-circle-line text-success',
    warning: 'ri-alert-line text-warning',
    info: 'ri-information-line text-info'
  };

  /**
   * Border + text only. The toast root always carries an opaque `bg-background`;
   * the variant colour is applied as a separate tint layer (see `getTintClasses`)
   * so toasts are never see-through over page content.
   */
  private variantClasses: Record<ToastVariant, string> = {
    default: 'border-border',
    destructive: 'border-destructive/50 text-destructive',
    success: 'border-success/50 text-success',
    warning: 'border-warning/50 text-warning',
    info: 'border-info/50 text-info'
  };

  private tintClasses: Record<ToastVariant, string> = {
    default: '',
    destructive: 'bg-destructive/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    info: 'bg-info/10'
  };

  private progressClasses: Record<ToastVariant, string> = {
    default: 'bg-primary',
    destructive: 'bg-destructive',
    success: 'bg-success',
    warning: 'bg-warning',
    info: 'bg-info'
  };

  private resolve(variant: string | undefined): ToastVariant {
    return variant && variant in this.variantClasses ? (variant as ToastVariant) : 'default';
  }

  getVariantClasses(variant?: string) {
    return this.variantClasses[this.resolve(variant)];
  }

  getTintClasses(variant?: string) {
    return this.tintClasses[this.resolve(variant)];
  }

  getProgressClasses(variant?: string) {
    return this.progressClasses[this.resolve(variant)];
  }

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
