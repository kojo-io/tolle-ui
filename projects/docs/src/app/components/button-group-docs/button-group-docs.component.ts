import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { ButtonGroupOverviewComponent } from './button-group-overview/button-group-overview.component';
import { ButtonGroupInteractiveComponent } from './button-group-interactive/button-group-interactive.component';
import { ButtonGroupExamplesComponent } from './button-group-examples/button-group-examples.component';
import { ButtonGroupApiComponent } from './button-group-api/button-group-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
  selector: 'app-button-group-docs',
  standalone: true,
  imports: [
    ButtonGroupOverviewComponent,
    ButtonGroupInteractiveComponent,
    ButtonGroupExamplesComponent,
    ButtonGroupApiComponent,
    DocsWrapperComponent

  ],
  templateUrl: './button-group-docs.component.html'
})
export class ButtonGroupDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }
}
