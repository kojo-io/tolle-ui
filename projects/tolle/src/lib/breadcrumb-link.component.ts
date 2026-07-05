import {Component, Input} from '@angular/core';
import {NgIf, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'tolle-breadcrumb-link',
  standalone: true,
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
      <a class="transition-colors hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    </ng-template>
  `,
  styles: ``
})
export class BreadcrumbLinkComponent {
  @Input() active: boolean = false;
}
