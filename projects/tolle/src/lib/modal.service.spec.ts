import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ApplicationRef, Component, Input } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { ModalService } from './modal.service';
import { SheetService } from './sheet.service';
import { componentInputs } from './component-inputs';

@Component({
  selector: 'test-greeting',
  template: `<p data-greeting>Hello, {{ name }}</p>`,
})
class GreetingComponent {
  @Input() name = '';
}

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

  it('binds `data` keys that are inputs of a component content, and keeps all of them on the ref', fakeAsync(() => {
    const ref = service.open({ content: GreetingComponent, data: { name: 'Ada', notAnInput: 1 } });
    TestBed.inject(ApplicationRef).tick();
    const shown = document.querySelector('.cdk-overlay-container [data-greeting]');
    expect(shown?.textContent?.trim()).toBe('Hello, Ada');
    expect(ref.modal.data).toEqual({ name: 'Ada', notAnInput: 1 });
    ref.close();
    tick(300);
  }));
});

describe('SheetService', () => {
  it('binds `data` keys that are inputs of a component content', fakeAsync(() => {
    TestBed.configureTestingModule({ imports: [OverlayModule] });
    const sheets = TestBed.inject(SheetService);
    const ref = sheets.open({ content: GreetingComponent, data: { name: 'Grace' } });
    TestBed.inject(ApplicationRef).tick();
    const shown = document.querySelector('.cdk-overlay-container [data-greeting]');
    expect(shown?.textContent?.trim()).toBe('Hello, Grace');
    ref.close();
    tick(1000);
  }));
});

describe('componentInputs', () => {
  it('keeps only real inputs, by template name', () => {
    expect(componentInputs(GreetingComponent, { name: 'Ada', other: 1 })).toEqual({ name: 'Ada' });
    expect(componentInputs(GreetingComponent, undefined)).toEqual({});
  });
});
