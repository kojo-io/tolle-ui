import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { BadgeOverviewComponent } from './badge-overview/badge-overview.component';
import { BadgeInteractiveComponent } from './badge-interactive/badge-interactive.component';
import { BadgeExamplesComponent } from './badge-examples/badge-examples.component';
import { BadgeApiComponent } from './badge-api/badge-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-badge-docs',
    imports: [
        BadgeOverviewComponent,
        BadgeInteractiveComponent,
        BadgeExamplesComponent,
        BadgeApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './badge-docs.component.html',
    styleUrl: './badge-docs.component.css'
})
export class BadgeDocsComponent {
  baseService = inject(BaseService);
}
