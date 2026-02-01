import { TestBed } from '@angular/core/testing';
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

        const dialogContent = overlayContainerElement.querySelector('tolle-alert-dialog-content div');
        expect(dialogContent?.classList.contains('max-w-lg')).toBeTrue();
    });

    it('should apply max-w-xs when size is xs', () => {
        service.open({
            title: 'Test',
            description: 'Test description',
            size: 'xs'
        });

        const dialogContent = overlayContainerElement.querySelector('tolle-alert-dialog-content div');
        expect(dialogContent?.classList.contains('max-w-xs')).toBeTrue();
    });

    it('should apply max-w-full when size is full', () => {
        service.open({
            title: 'Test',
            description: 'Test description',
            size: 'full'
        });

        const dialogContent = overlayContainerElement.querySelector('tolle-alert-dialog-content div');
        expect(dialogContent?.classList.contains('max-w-full')).toBeTrue();
    });
});
