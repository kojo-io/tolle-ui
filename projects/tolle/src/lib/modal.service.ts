import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Modal } from './modal';
import { ModalRef } from './modal-ref';
import { ModalComponent } from './modal.component';
import { ModalStackService } from './modal-stack.service';

@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(
    private overlay: Overlay,
    private injector: Injector,
    private stack: ModalStackService
  ) {}

  open<R = any>(config: Modal): ModalRef<R> {
    // 1. Create the Overlay (DOM placeholder)
    const overlayRef = this.createOverlay();

    // 2. Create the Controller (Ref)
    const modalRef = new ModalRef<R>(overlayRef, config, this.stack);

    // 3. Create Injector to allow the Component to access the Ref
    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: ModalRef, useValue: modalRef }]
    });

    // 4. Attach the UI Component to the Overlay
    const portal = new ComponentPortal(ModalComponent, null, injector);
    overlayRef.attach(portal);

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
      backdropClass: ['bg-black/80', 'backdrop-blur-sm'],
      // 1. Remove hardcoded 'fixed' classes from here
      // 2. Add 'w-full' and 'h-full' to the panel to create a workspace
      panelClass: ['w-full', 'h-full', 'flex', 'items-center', 'justify-center', 'pointer-events-none'],
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });

    return this.overlay.create(config);
  }


}
