import { ElementRef } from '@angular/core';
import { TooltipDirective } from './tooltip.directive';

describe('TooltipDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = { nativeElement: document.createElement('div') } as ElementRef;
    const directive = new TooltipDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
