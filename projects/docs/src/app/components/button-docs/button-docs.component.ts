import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { ButtonOverviewComponent } from './button-overview/button-overview.component';
import { ButtonInteractiveComponent } from './button-interactive/button-interactive.component';
import { ButtonExamplesComponent } from './button-examples/button-examples.component';
import { ButtonApiComponent } from './button-api/button-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-button-docs',
    imports: [
        ButtonOverviewComponent,
        ButtonInteractiveComponent,
        ButtonExamplesComponent,
        ButtonApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './button-docs.component.html'
})
export class ButtonDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }
}
