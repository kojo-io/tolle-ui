import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { ScrollAreaOverviewComponent } from './scroll-area-overview/scroll-area-overview.component';
import { ScrollAreaInteractiveComponent } from './scroll-area-interactive/scroll-area-interactive.component';
import { ScrollAreaApiComponent } from './scroll-area-api/scroll-area-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-scroll-area-docs',
    standalone: true,
    imports: [
        CommonModule,
        ScrollAreaOverviewComponent,
        ScrollAreaInteractiveComponent,
        ScrollAreaApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './scroll-area-docs.component.html'
})
export class ScrollAreaDocsComponent implements OnInit {
    baseService = inject(BaseService);
    analytics = inject(AnalyticsService);

    ngOnInit(): void {
        this.analytics.init();
    }
}
