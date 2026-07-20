import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ApplicationRef } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [OverlayModule] });
    service = TestBed.inject(ModalService);
  });

  afterEach(() => {
    service.closeAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('applies real defaults to a plain config literal, since it is never a `new Modal()` instance', () => {
    const ref = service.open({ content: 'Hello' });
    expect(ref.modal.showCloseButton).toBe(true);
    expect(ref.modal.backdropClose).toBe(true);
    expect(ref.modal.size).toBe('default');
  });

  it('lets an explicit config value override a default', () => {
    const ref = service.open({ content: 'Hello', showCloseButton: false, size: 'lg' });
    expect(ref.modal.showCloseButton).toBe(false);
    expect(ref.modal.size).toBe('lg');
  });

  it('waits for the exit animation before disposing the overlay on close', fakeAsync(() => {
    const ref = service.open({ content: 'Hello there' });
    TestBed.inject(ApplicationRef).tick(); // dynamically-attached views need an explicit tick in tests
    const overlayContainer = () => document.querySelector('.cdk-overlay-container');

    expect(overlayContainer()?.textContent).toContain('Hello there');

    ref.close();
    // Still present immediately — the exit animation hasn't had a chance to play yet.
    expect(overlayContainer()?.textContent).toContain('Hello there');

    tick(300); // the fallback timeout in ModalRef, in case animationend never fires
    expect(overlayContainer()?.textContent ?? '').not.toContain('Hello there');
  }));
});
