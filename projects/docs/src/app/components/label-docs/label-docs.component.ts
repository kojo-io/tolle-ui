import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { LabelOverviewComponent } from './label-overview/label-overview.component';
import { LabelInteractiveComponent } from './label-interactive/label-interactive.component';
import { LabelApiComponent } from './label-api/label-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-label-docs',
    standalone: true,
    imports: [
        CommonModule,
        LabelOverviewComponent,
        LabelInteractiveComponent,
        LabelApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './label-docs.component.html'
})
export class LabelDocsComponent implements OnInit {
    baseService = inject(BaseService);
    analytics = inject(AnalyticsService);

    ngOnInit(): void {
        this.analytics.init();
    }
}
