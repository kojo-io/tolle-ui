import {Component, inject, OnInit} from '@angular/core';

@Component({
    selector: 'tolle-breadcrumb-item',
    imports: [],
    template: `
    <li class="inline-flex items-center gap-1.5">
      <ng-content></ng-content>
    </li>
  `,
    styles: ``
})
export class BreadcrumbItemComponent {

}
