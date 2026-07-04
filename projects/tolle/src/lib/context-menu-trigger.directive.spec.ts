import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ContextMenuTriggerDirective } from './context-menu-trigger.directive';
import { ContextMenuService } from './context-menu.service';

describe('ContextMenuTriggerDirective', () => {
  it('should create an instance', () => {
    // The directive uses field-initializer inject(), so it must be built inside
    // an injection context with ElementRef + ContextMenuService available.
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
        { provide: ContextMenuService, useValue: {} },
      ],
    });
    const directive = TestBed.runInInjectionContext(() => new ContextMenuTriggerDirective());
    expect(directive).toBeTruthy();
  });
});
