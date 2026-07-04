import { TemplateRef } from '@angular/core';
import { TolleCellDirective } from './tolle-cell.directive';

describe('TolleCellDirective', () => {
  it('should create an instance', () => {
    const directive = new TolleCellDirective({} as TemplateRef<any>);
    expect(directive).toBeTruthy();
  });
});
