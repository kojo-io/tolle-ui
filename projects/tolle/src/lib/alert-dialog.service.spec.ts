import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ApplicationRef } from '@angular/core';
import { AlertDialogService } from './alert-dialog.service';
import { AlertDialogConfig } from './alert-dialog.types';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AlertDialogService Sizing', () => {
    let service: AlertDialogService;
    let overlayContainer: OverlayContainer;
    let overlayContainerElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            providers: [AlertDialogService]
        });

        service = TestBed.inject(AlertDialogService);
        overlayContainer = TestBed.inject(OverlayContainer);
        overlayContainerElement = overlayContainer.getContainerElement();
    });

    afterEach(() => {
        overlayContainer.ngOnDestroy();
    });

    it('should apply max-w-lg by default', () => {
        service.open({
            title: 'Test',
            description: 'Test description'
        });

        // config is set after the overlay attaches, so flush CD to render the size class.
        TestBed.inject(ApplicationRef).tick();

        const dialogContent = overlayContainerElement.querySelector('tolle-alert-dialog-content div[role="alertdialog"]');
        expect(dialogContent?.classList.contains('max-w-lg')).toBeTrue();
    });

    it('should apply max-w-xs when size is xs', () => {
        service.open({
            title: 'Test',
            description: 'Test description',
            size: 'xs'
        });

        // config is set after the overlay attaches, so flush CD to render the size class.
        TestBed.inject(ApplicationRef).tick();

        const dialogContent = overlayContainerElement.querySelector('tolle-alert-dialog-content div[role="alertdialog"]');
        expect(dialogContent?.classList.contains('max-w-xs')).toBeTrue();
    });

    it('should apply max-w-full when size is full', () => {
        service.open({
            title: 'Test',
            description: 'Test description',
            size: 'full'
        });

        // config is set after the overlay attaches, so flush CD to render the size class.
        TestBed.inject(ApplicationRef).tick();

        const dialogContent = overlayContainerElement.querySelector('tolle-alert-dialog-content div[role="alertdialog"]');
        expect(dialogContent?.classList.contains('max-w-full')).toBeTrue();
    });
});

describe('AlertDialogService animation timing', () => {
    let service: AlertDialogService;
    let overlayContainer: OverlayContainer;
    let overlayContainerElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            providers: [AlertDialogService]
        });

        service = TestBed.inject(AlertDialogService);
        overlayContainer = TestBed.inject(OverlayContainer);
        overlayContainerElement = overlayContainer.getContainerElement();
    });

    afterEach(() => {
        overlayContainer.ngOnDestroy();
    });

    it('emits the result on afterClosed$ immediately, without waiting for the exit animation', fakeAsync(() => {
        const ref = service.open({ title: 'Delete account', description: 'This cannot be undone.' });
        TestBed.inject(ApplicationRef).tick();

        let result: boolean | undefined;
        ref.afterClosed$.subscribe((r) => (result = r));

        ref.close(true);
        expect(result).toBe(true);

        tick(300); // flush the service's fallback disposal timer so the test ends clean
    }));

    it('waits for the exit animation before disposing the overlay on close', fakeAsync(() => {
        const ref = service.open({ title: 'Delete account', description: 'This cannot be undone.' });
        TestBed.inject(ApplicationRef).tick();
        expect(overlayContainerElement.textContent).toContain('Delete account');

        ref.close(false);
        TestBed.inject(ApplicationRef).tick();
        // Still present immediately — the exit animation hasn't had a chance to play yet.
        expect(overlayContainerElement.textContent).toContain('Delete account');

        tick(300); // the fallback timeout, in case animationend never fires
        expect(overlayContainerElement.textContent).not.toContain('Delete account');
    }));
});

describe('AlertDialogService afterClosed$ result', () => {
    let service: AlertDialogService;
    let overlayContainer: OverlayContainer;
    let overlayContainerElement: HTMLElement;

    const flush = () => TestBed.inject(ApplicationRef).tick();
    const actionButton = () =>
        overlayContainerElement.querySelector('tolle-alert-dialog-action button') as HTMLButtonElement | null;
    const cancelButton = () =>
        overlayContainerElement.querySelector('tolle-alert-dialog-cancel button') as HTMLButtonElement | null;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            providers: [AlertDialogService]
        });

        service = TestBed.inject(AlertDialogService);
        overlayContainer = TestBed.inject(OverlayContainer);
        overlayContainerElement = overlayContainer.getContainerElement();
    });

    afterEach(() => {
        overlayContainer.ngOnDestroy();
    });

    // Regression: clicking the action button used to race the button's own
    // `setOpen(false)` close path and emit `false` instead of `true`, so a
    // consumer's confirm handler never ran.
    it('emits true exactly once when the action button is clicked', fakeAsync(() => {
        const ref = service.open({ title: 'Delete?', description: 'Cannot be undone.', actionText: 'Delete' });
        flush();

        const emitted: boolean[] = [];
        ref.afterClosed$.subscribe((r) => emitted.push(r));

        actionButton()!.click();
        flush();
        tick(300); // flush the fallback disposal timer so the test ends clean

        expect(emitted).toEqual([true]);
    }));

    it('emits false exactly once when the cancel button is clicked', fakeAsync(() => {
        const ref = service.open({ title: 'Delete?', description: 'Cannot be undone.' });
        flush();

        const emitted: boolean[] = [];
        ref.afterClosed$.subscribe((r) => emitted.push(r));

        cancelButton()!.click();
        flush();
        tick(300);

        expect(emitted).toEqual([false]);
    }));

    it('close() is idempotent — the first result wins and later closes are ignored', fakeAsync(() => {
        const ref = service.open({ title: 'Delete?', description: 'Cannot be undone.' });
        flush();

        const emitted: boolean[] = [];
        ref.afterClosed$.subscribe((r) => emitted.push(r));

        ref.close(true);
        ref.close(false);
        expect(emitted).toEqual([true]);

        tick(300);
    }));
});
