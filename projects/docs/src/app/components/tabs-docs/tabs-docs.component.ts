import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { TabsOverviewComponent } from './tabs-overview/tabs-overview.component';
import { TabsInteractiveComponent } from './tabs-interactive/tabs-interactive.component';
import { TabsApiComponent } from './tabs-api/tabs-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tabs-docs',
    imports: [
        CommonModule,
        TabsOverviewComponent,
        TabsInteractiveComponent,
        TabsApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './tabs-docs.component.html'
})
export class TabsDocsComponent implements OnInit {
    baseService = inject(BaseService);
    analytics = inject(AnalyticsService);

    ngOnInit(): void {
        this.analytics.init();
    }
}
