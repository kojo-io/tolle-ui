import { Injectable, inject, ViewContainerRef, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AlertDialogConfig, AlertDialogRef } from './alert-dialog.types';
import { AlertDialogDynamicComponent } from './alert-dialog-dynamic.component';

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
            backdropClass: ['cdk-overlay-backdrop', 'bg-black/80', 'backdrop-blur-sm'],
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
            scrollStrategy: this.overlay.scrollStrategies.block()
        });

        const overlayRef = this.overlay.create(overlayConfig);
        const dialogRef = new AlertDialogRef();

        const portal = new ComponentPortal(AlertDialogDynamicComponent, null, this.injector);
        const componentRef = overlayRef.attach(portal);

        componentRef.instance.config = config;
        componentRef.instance.dialogRef = dialogRef;

        dialogRef.afterClosed$.subscribe(() => {
            overlayRef.detach();
            overlayRef.dispose();
            // Restore focus to the trigger.
            previouslyFocused?.focus?.();
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
