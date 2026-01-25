import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { CollapsibleOverviewComponent } from './collapsible-overview/collapsible-overview.component';
import { CollapsibleInteractiveComponent } from './collapsible-interactive/collapsible-interactive.component';
import { CollapsibleApiComponent } from './collapsible-api/collapsible-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-collapsible-docs',
    standalone: true,
    imports: [
        CommonModule,
        CollapsibleOverviewComponent,
        CollapsibleInteractiveComponent,
        CollapsibleApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './collapsible-docs.component.html'
})
export class CollapsibleDocsComponent implements OnInit {
    baseService = inject(BaseService);
    analytics = inject(AnalyticsService);

    ngOnInit(): void {
        this.analytics.init();
    }
}
