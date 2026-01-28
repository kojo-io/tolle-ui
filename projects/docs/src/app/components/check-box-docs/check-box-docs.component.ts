import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { CheckBoxOverviewComponent } from './check-box-overview/check-box-overview.component';
import { CheckBoxInteractiveComponent } from './check-box-interactive/check-box-interactive.component';
import { CheckBoxExamplesComponent } from './check-box-examples/check-box-examples.component';
import { CheckBoxApiComponent } from './check-box-api/check-box-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-check-box-docs',
    imports: [
        CheckBoxOverviewComponent,
        CheckBoxInteractiveComponent,
        CheckBoxExamplesComponent,
        CheckBoxApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './check-box-docs.component.html',
    styleUrl: './check-box-docs.component.css'
})
export class CheckBoxDocsComponent {
  baseService = inject(BaseService);
}
