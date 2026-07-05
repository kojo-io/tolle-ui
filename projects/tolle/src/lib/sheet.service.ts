import { Injectable, Injector, inject } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SheetConfig } from './sheet.types';
import { SheetRef } from './sheet-ref';
import { SheetWrapperComponent } from './sheet-wrapper.component';

@Injectable({ providedIn: 'root' })
export class SheetService {
    private overlay = inject(Overlay);
    private injector = inject(Injector);

    open<R = any>(config: SheetConfig): SheetRef<R> {
        // Remember the trigger so focus can be restored once the sheet is disposed.
        const previouslyFocused = document.activeElement as HTMLElement | null;

        const overlayRef = this.createOverlay(config);
        const sheetRef = new SheetRef<R>(overlayRef, config);

        // Restore focus to the trigger after the overlay tears down.
        overlayRef.detachments().subscribe(() => previouslyFocused?.focus?.());

        const customInjector = Injector.create({
            parent: this.injector,
            providers: [
                { provide: SheetRef, useValue: sheetRef }
            ]
        });

        const portal = new ComponentPortal(SheetWrapperComponent, null, customInjector);
        overlayRef.attach(portal);

        // Override the close method to add animation delay
        const originalClose = sheetRef.close.bind(sheetRef);
        sheetRef.close = (result?: R) => {
            originalClose(result);
            // Wait for exit animation (matches CSS duration)
            setTimeout(() => {
                sheetRef.dispose();
            }, 300);
        };

        return sheetRef;
    }

    private createOverlay(config: SheetConfig): OverlayRef {
        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop !== false,
            backdropClass: 'tolle-modal-backdrop',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
        });

        return this.overlay.create(overlayConfig);
    }
}
