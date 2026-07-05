import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { InputOverviewComponent } from './input-overview/input-overview.component';
import { InputInteractiveComponent } from './input-interactive/input-interactive.component';
import { InputApiComponent } from './input-api/input-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-input-docs',
    imports: [
        InputOverviewComponent,
        InputInteractiveComponent,
        InputApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './input-docs.component.html',
    styleUrl: './input-docs.component.css'
})
export class InputDocsComponent {
    baseService = inject(BaseService);
}
