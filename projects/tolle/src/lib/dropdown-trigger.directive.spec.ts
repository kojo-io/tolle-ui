import { ElementRef, ViewContainerRef } from '@angular/core';
import { DropdownTriggerDirective } from './dropdown-trigger.directive';

describe('DropdownTriggerDirective', () => {
  it('should create an instance', () => {
    const el = new ElementRef(document.createElement('div'));
    const vcr = {} as ViewContainerRef;
    const directive = new DropdownTriggerDirective(el, vcr);
    expect(directive).toBeTruthy();
  });
});
