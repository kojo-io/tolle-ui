import {Component, Input} from '@angular/core';
import {NgIf, NgTemplateOutlet} from '@angular/common';

@Component({
    selector: 'tolle-breadcrumb-link',
    imports: [
        NgIf,
        NgTemplateOutlet
    ],
    template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>

    <ng-container *ngIf="active; else linkTemplate">
      <span
        role="link"
        aria-disabled="true"
        aria-current="page"
        class="font-normal text-foreground"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </span>
    </ng-container>

    <ng-template #linkTemplate>
      <div class="transition-colors hover:text-foreground cursor-pointer">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </div>
    </ng-template>
  `,
    styles: ``
})
export class BreadcrumbLinkComponent {
  @Input() active: boolean = false;
}
