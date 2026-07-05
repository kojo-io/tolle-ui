import { Component, inject } from '@angular/core';
import { BreadcrumbOverviewComponent } from './breadcrumb-overview/breadcrumb-overview.component';
import { BreadcrumbInteractiveComponent } from './breadcrumb-interactive/breadcrumb-interactive.component';
import { BreadcrumbExamplesComponent } from './breadcrumb-examples/breadcrumb-examples.component';
import { BreadcrumbApiComponent } from './breadcrumb-api/breadcrumb-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';

import { BaseService } from '../../shared/base.service';

@Component({
    selector: 'app-breadcrumb-docs',
    imports: [
        BreadcrumbOverviewComponent,
        BreadcrumbInteractiveComponent,
        BreadcrumbExamplesComponent,
        BreadcrumbApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './breadcrumb-docs.component.html'
})
export class BreadcrumbDocsComponent {
  baseService = inject(BaseService);
}
