import { Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'tolle-breadcrumb-link',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>

    @if (active) {
      <span
        role="link"
        aria-disabled="true"
        aria-current="page"
        class="font-normal text-foreground">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </span>
    } @else {
      <a
        class="cursor-pointer rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
    }
  `,
})
export class BreadcrumbLinkComponent {
  @Input() active: boolean = false;
}
