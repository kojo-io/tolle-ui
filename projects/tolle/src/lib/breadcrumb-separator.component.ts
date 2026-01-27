import { Component } from '@angular/core';

@Component({
    selector: 'tolle-breadcrumb-separator',
    imports: [],
    template: `
    <li role="presentation" aria-hidden="true" class="[&>i]:size-3.5">
      <ng-content>
        <i class="ri-arrow-right-s-line"></i>
      </ng-content>
    </li>
  `,
    styles: ``
})
export class BreadcrumbSeparatorComponent {

}
