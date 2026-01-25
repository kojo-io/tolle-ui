import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { SheetConfig } from './sheet.types';

export class SheetRef<R = any> {
    private readonly _afterClosed$ = new Subject<R | undefined | null>();
    afterClosed$ = this._afterClosed$.asObservable();

    constructor(
        private overlay: OverlayRef,
        public config: SheetConfig
    ) {
        if (this.config.hasBackdrop && this.config.backdropClose !== false) {
            this.overlay.backdropClick().subscribe(() => {
                this.close();
            });
        }
    }

    /**
     * Closes the sheet and allows for the exit animation.
     * @param result Data to pass back to the caller
     */
    close(result?: R): void {
        // Notify the wrapper component to trigger exit animation if needed
        // In our service implementation, the wrapper handles [attr.data-state]
        // We just need to give it time to animate out before disposing

        // We'll update the state to 'closed' which triggers CSS animations
        // The service handles the actual disposal after a timeout
        this._afterClosed$.next(result);
        this._afterClosed$.complete();
    }

    /**
     * Internal use only: Disposes the overlay
     */
    dispose(): void {
        this.overlay.dispose();
    }
}
