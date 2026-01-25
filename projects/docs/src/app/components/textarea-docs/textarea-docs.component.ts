import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextareaOverviewComponent } from './textarea-overview/textarea-overview.component';
import { TextareaInteractiveComponent } from './textarea-interactive/textarea-interactive.component';
import { TextareaApiComponent } from './textarea-api/textarea-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BaseService } from '../../shared/base.service';


@Component({
    selector: 'app-textarea-docs',
    standalone: true,
    imports: [
        CommonModule,
        TextareaOverviewComponent,
        TextareaInteractiveComponent,
        TextareaApiComponent,
        DocsWrapperComponent

    ],
    templateUrl: './textarea-docs.component.html',
    styleUrls: ['./textarea-docs.component.css']
})
export class TextareaDocsComponent {
    baseService = inject(BaseService);
}
