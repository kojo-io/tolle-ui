import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { SliderOverviewComponent } from './slider-overview/slider-overview.component';
import { SliderInteractiveComponent } from './slider-interactive/slider-interactive.component';
import { SliderApiComponent } from './slider-api/slider-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-slider-docs',
    standalone: true,
    imports: [
        CommonModule,
        SliderOverviewComponent,
        SliderInteractiveComponent,
        SliderApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './slider-docs.component.html'
})
export class SliderDocsComponent implements OnInit {
    baseService = inject(BaseService);
    analytics = inject(AnalyticsService);

    ngOnInit(): void {
        this.analytics.init();
    }
}
