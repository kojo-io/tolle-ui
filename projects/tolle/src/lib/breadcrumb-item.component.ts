import { Component } from '@angular/core';

@Component({
  selector: 'tolle-breadcrumb-item',
  standalone: true,
  imports: [],
  template: `
    <li class="inline-flex items-center gap-1.5">
      <ng-content></ng-content>
    </li>
  `
})
export class BreadcrumbItemComponent { }
