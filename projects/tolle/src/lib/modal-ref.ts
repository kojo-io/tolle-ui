import { OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject, Subject } from 'rxjs';
import { Modal } from './modal';
import { ModalStackService } from './modal-stack.service';

/**
 * Safety net if the exit animation's `animationend` never fires — reduced
 * motion, no matching keyframe, or a panel that never rendered — so a modal
 * can never get stuck open forever.
 */
const CLOSE_FALLBACK_MS = 300;

export class ModalRef<R = any> {
  private readonly _afterClosed$ = new Subject<R | undefined | null>();
  afterClosed$ = this._afterClosed$.asObservable();

  private readonly _closingSubject = new BehaviorSubject<boolean>(false);
  /** True once `close()` has been called — drives the panel's exit animation. */
  readonly closing$ = this._closingSubject.asObservable();

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
   * Closes the modal. Signals the panel and backdrop to play their exit
   * animation, then tears down the overlay once it finishes (or after
   * `CLOSE_FALLBACK_MS`, whichever comes first).
   * @param result Data to pass back to the caller
   */
  close(result?: R): void {
    if (this._closingSubject.value) return;
    this._closingSubject.next(true);
    this.overlay.backdropElement?.setAttribute('data-state', 'closed');

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      this._afterClosed$.next(result);
      this._afterClosed$.complete();
      this.overlay.dispose();
      this.stack.unregister(this);
    };

    const panel = this.overlay.overlayElement.querySelector<HTMLElement>('[data-state]');
    if (panel) {
      panel.addEventListener('animationend', finish, { once: true });
      setTimeout(finish, CLOSE_FALLBACK_MS);
    } else {
      finish();
    }
  }
}
