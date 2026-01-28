import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { HoverCardOverviewComponent } from './hover-card-overview/hover-card-overview.component';
import { HoverCardInteractiveComponent } from './hover-card-interactive/hover-card-interactive.component';
import { HoverCardApiComponent } from './hover-card-api/hover-card-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-hover-card-docs',
    imports: [
    HoverCardOverviewComponent,
    HoverCardInteractiveComponent,
    HoverCardApiComponent,
    DocsWrapperComponent
],
    templateUrl: './hover-card-docs.component.html'
})
export class HoverCardDocsComponent implements OnInit {
    baseService = inject(BaseService);
    analytics = inject(AnalyticsService);

    ngOnInit(): void {
        this.analytics.init();
    }
}
