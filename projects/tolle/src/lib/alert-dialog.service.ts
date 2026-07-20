import { Injectable, inject, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AlertDialogConfig, AlertDialogRef } from './alert-dialog.types';
import { AlertDialogDynamicComponent } from './alert-dialog-dynamic.component';
import { CLOSE_FALLBACK_MS } from './alert-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class AlertDialogService {
    private overlay = inject(Overlay);
    private injector = inject(Injector);

    open(config: AlertDialogConfig): AlertDialogRef {
        // Remember the trigger so focus can be restored on close.
        const previouslyFocused = document.activeElement as HTMLElement | null;

        const overlayConfig = new OverlayConfig({
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
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
            scrollStrategy: this.overlay.scrollStrategies.block()
        });

        const overlayRef = this.overlay.create(overlayConfig);
        const dialogRef = new AlertDialogRef();

        const portal = new ComponentPortal(AlertDialogDynamicComponent, null, this.injector);
        const componentRef = overlayRef.attach(portal);

        // The backdrop element only exists once attached — setting this any
        // earlier would silently no-op.
        overlayRef.backdropElement?.setAttribute('data-state', 'open');

        componentRef.instance.config = config;
        componentRef.instance.dialogRef = dialogRef;

        // The result (`afterClosed$`) is ready immediately, but disposing the
        // overlay waits for the content panel's exit animation to finish (or
        // a fallback timeout), so `data-[state=closed]:animate-out` gets a
        // chance to play instead of being torn down mid-frame.
        dialogRef.afterClosed$.subscribe(() => {
            overlayRef.backdropElement?.setAttribute('data-state', 'closed');
            componentRef.instance.closing = true;

            let finished = false;
            const finish = () => {
                if (finished) return;
                finished = true;
                overlayRef.detach();
                overlayRef.dispose();
                // Restore focus to the trigger.
                previouslyFocused?.focus?.();
            };

            const panel = overlayRef.overlayElement.querySelector<HTMLElement>('[data-state]');
            if (panel) {
                panel.addEventListener('animationend', finish, { once: true });
                setTimeout(finish, CLOSE_FALLBACK_MS);
            } else {
                finish();
            }
        });

        // Alert-dialog semantics: backdrop clicks must NOT dismiss.
        // Escape still closes the dialog.
        overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                dialogRef.close(false);
            }
        });

        return dialogRef;
    }
}
