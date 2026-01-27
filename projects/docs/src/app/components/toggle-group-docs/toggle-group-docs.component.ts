import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { ToggleGroupOverviewComponent } from './toggle-group-overview/toggle-group-overview.component';
import { ToggleGroupInteractiveComponent } from './toggle-group-interactive/toggle-group-interactive.component';
import { ToggleGroupApiComponent } from './toggle-group-api/toggle-group-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-toggle-group-docs',
    imports: [
    ToggleGroupOverviewComponent,
    ToggleGroupInteractiveComponent,
    ToggleGroupApiComponent,
    DocsWrapperComponent
],
    templateUrl: './toggle-group-docs.component.html'
})
export class ToggleGroupDocsComponent implements OnInit {
    baseService = inject(BaseService);
    analytics = inject(AnalyticsService);

    ngOnInit(): void {
        this.analytics.init();
    }
}
