import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../../../tolle/src/lib/breadcrumb.component';
import { BreadcrumbItemComponent } from '../../../../../tolle/src/lib/breadcrumb-item.component';
import { BreadcrumbLinkComponent } from '../../../../../tolle/src/lib/breadcrumb-link.component';
import { BreadcrumbSeparatorComponent } from '../../../../../tolle/src/lib/breadcrumb-separator.component';

@Component({
    selector: 'app-custom-separator-breadcrumb',
    standalone: true,
    imports: [
        BreadcrumbComponent,
        BreadcrumbItemComponent,
        BreadcrumbLinkComponent,
        BreadcrumbSeparatorComponent
    ],
    template: `
    <tolle-breadcrumb>
      <tolle-breadcrumb-item>
        <tolle-breadcrumb-link>Home</tolle-breadcrumb-link>
      </tolle-breadcrumb-item>
      <tolle-breadcrumb-separator>
        <i class="ri-arrow-right-double-line text-muted-foreground/50"></i>
      </tolle-breadcrumb-separator>
      <tolle-breadcrumb-item>
        <tolle-breadcrumb-link>Components</tolle-breadcrumb-link>
      </tolle-breadcrumb-item>
      <tolle-breadcrumb-separator>
        <i class="ri-arrow-right-double-line text-muted-foreground/50"></i>
      </tolle-breadcrumb-separator>
      <tolle-breadcrumb-item>
        <tolle-breadcrumb-link [active]="true">Breadcrumb</tolle-breadcrumb-link>
      </tolle-breadcrumb-item>
    </tolle-breadcrumb>
  `
})
export class CustomSeparatorBreadcrumbComponent { }
