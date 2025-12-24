import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tolleCell]',
  standalone: true
})
export class TolleCellDirective {
  @Input('tolleCell') name!: string; // The column key this template belongs to
  constructor(public template: TemplateRef<any>) {}
}
