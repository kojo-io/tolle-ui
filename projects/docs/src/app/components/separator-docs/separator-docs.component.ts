import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { SeparatorOverviewComponent } from './separator-overview/separator-overview.component';
import { SeparatorInteractiveComponent } from './separator-interactive/separator-interactive.component';
import { SeparatorApiComponent } from './separator-api/separator-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-separator-docs',
    imports: [
    SeparatorOverviewComponent,
    SeparatorInteractiveComponent,
    SeparatorApiComponent,
    DocsWrapperComponent
],
    templateUrl: './separator-docs.component.html'
})
export class SeparatorDocsComponent implements OnInit {
    baseService = inject(BaseService);
    analytics = inject(AnalyticsService);

    ngOnInit(): void {
        this.analytics.init();
    }
}
