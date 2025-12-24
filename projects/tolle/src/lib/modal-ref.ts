import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { Modal } from './modal';
import { ModalStackService } from './modal-stack.service';

export class ModalRef<R = any> {
  private readonly _afterClosed$ = new Subject<R | undefined | null>();
  afterClosed$ = this._afterClosed$.asObservable();

  constructor(
    private overlay: OverlayRef,
    public modal: Modal,
    private stack: ModalStackService
  ) {
    this.stack.register(this);

    // Handle Backdrop Click
    this.overlay.backdropClick().subscribe(() => {
      if (this.modal.backdropClose) {
        this.close();
      }
    });
  }

  /**
   * Closes the modal instantly.
   * @param result Data to pass back to the caller
   */
  close(result?: R): void {
    this._afterClosed$.next(result);
    this._afterClosed$.complete();
    this.overlay.dispose(); // Instant disposal (No animation timer)
    this.stack.unregister(this);
  }
}
