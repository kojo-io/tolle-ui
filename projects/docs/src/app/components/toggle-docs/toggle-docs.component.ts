import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { ToggleOverviewComponent } from './toggle-overview/toggle-overview.component';
import { ToggleInteractiveComponent } from './toggle-interactive/toggle-interactive.component';
import { ToggleApiComponent } from './toggle-api/toggle-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-toggle-docs',
    imports: [
        CommonModule,
        ToggleOverviewComponent,
        ToggleInteractiveComponent,
        ToggleApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './toggle-docs.component.html'
})
export class ToggleDocsComponent implements OnInit {
    baseService = inject(BaseService);
    analytics = inject(AnalyticsService);

    ngOnInit(): void {
        this.analytics.init();
    }
}
