import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { RadioGroupOverviewComponent } from './radio-group-overview/radio-group-overview.component';
import { RadioGroupInteractiveComponent } from './radio-group-interactive/radio-group-interactive.component';
import { RadioGroupApiComponent } from './radio-group-api/radio-group-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-radio-group-docs',
    standalone: true,
    imports: [
        RadioGroupOverviewComponent,
        RadioGroupInteractiveComponent,
        RadioGroupApiComponent,
        DocsWrapperComponent

    ],
    templateUrl: './radio-group-docs.component.html',
    styleUrl: './radio-group-docs.component.css'
})
export class RadioGroupDocsComponent {
    baseService = inject(BaseService);
}
