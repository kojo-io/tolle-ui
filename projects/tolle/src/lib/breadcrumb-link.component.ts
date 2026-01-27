import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'tolle-breadcrumb-link',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
    
    @if (active()) {
      <span
        role="link"
        aria-disabled="true"
        aria-current="page"
        class="font-normal text-foreground"
        >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </span>
    } @else {
      <div class="transition-colors hover:text-foreground cursor-pointer">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </div>
    }
  `
})
export class BreadcrumbLinkComponent {
  active = input(false);
}
