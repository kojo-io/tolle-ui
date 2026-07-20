import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Modal } from './modal';
import { ModalRef } from './modal-ref';
import { ModalComponent } from './modal.component';
import { ModalStackService } from './modal-stack.service';

/**
 * `open()` always receives a plain object literal, never a `new Modal()`
 * instance, so a class field initializer would never actually apply — these
 * are the real defaults, merged in explicitly below.
 */
const MODAL_DEFAULTS: Required<Pick<Modal, 'size' | 'backdropClose' | 'showCloseButton'>> = {
  size: 'default',
  backdropClose: true,
  showCloseButton: true,
};

@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(
    private overlay: Overlay,
    private injector: Injector,
    private stack: ModalStackService
  ) {}

  open<R = any>(config: Modal): ModalRef<R> {
    const resolved: Modal = { ...MODAL_DEFAULTS, ...config };

    // 0. Remember what was focused so we can restore it after the modal closes.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // 1. Create the Overlay (DOM placeholder)
    const overlayRef = this.createOverlay();

    // 2. Create the Controller (Ref)
    const modalRef = new ModalRef<R>(overlayRef, resolved, this.stack);

    // 3. Create Injector to allow the Component to access the Ref
    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: ModalRef, useValue: modalRef }]
    });

    // Escape-to-close: mirror the backdrop close path, but only for
    // non-blocking modals (backdropClose !== false).
    overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
      if (event.key === 'Escape' && resolved.backdropClose) {
        event.preventDefault();
        modalRef.close();
      }
    });

    // Restore focus to the trigger once the overlay is torn down.
    overlayRef.detachments().subscribe(() => previouslyFocused?.focus?.());

    // 4. Attach the UI Component to the Overlay
    const portal = new ComponentPortal(ModalComponent, null, injector);
    overlayRef.attach(portal);

    // The backdrop element only exists once attached — setting this any
    // earlier (e.g. in ModalRef's constructor) would silently no-op.
    overlayRef.backdropElement?.setAttribute('data-state', 'open');

    return modalRef;
  }

  /** Global helper to close everything */
  closeAll() {
    this.stack.closeAll();
  }

  // modal.service.ts
  private createOverlay(): OverlayRef {
    const config = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: [
        'cdk-overlay-backdrop',
        'bg-black/80',
        'backdrop-blur-sm',
        'data-[state=open]:animate-in',
        'data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
      ],
      panelClass: [
        'w-full',
        'h-full',
        'flex',
        'items-center',
        'justify-center',
        'pointer-events-none'
      ],
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });

    return this.overlay.create(config);
  }


}
