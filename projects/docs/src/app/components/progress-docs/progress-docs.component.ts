import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { ProgressOverviewComponent } from './progress-overview/progress-overview.component';
import { ProgressInteractiveComponent } from './progress-interactive/progress-interactive.component';
import { ProgressApiComponent } from './progress-api/progress-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-progress-docs',
    imports: [
        CommonModule,
        ProgressOverviewComponent,
        ProgressInteractiveComponent,
        ProgressApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './progress-docs.component.html'
})
export class ProgressDocsComponent implements OnInit {
    baseService = inject(BaseService);
    analytics = inject(AnalyticsService);

    ngOnInit(): void {
        this.analytics.init();
    }
}
