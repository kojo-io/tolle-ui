import { Directive, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tolleCell]',
  standalone: true
})
export class TolleCellDirective {
  name = input.required<string>({ alias: 'tolleCell' });
  constructor(public template: TemplateRef<any>) { }
}
