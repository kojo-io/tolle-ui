import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { CardOverviewComponent } from './card-overview/card-overview.component';
import { CardInteractiveComponent } from './card-interactive/card-interactive.component';
import { CardExamplesComponent } from './card-examples/card-examples.component';
import { CardApiComponent } from './card-api/card-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-card-docs',
    imports: [
        CardOverviewComponent,
        CardInteractiveComponent,
        CardExamplesComponent,
        CardApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './card-docs.component.html',
    styleUrl: './card-docs.component.css'
})
export class CardDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }
}
