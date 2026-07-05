import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { MaskedInputOverviewComponent } from './masked-input-overview/masked-input-overview.component';
import { MaskedInputInteractiveComponent } from './masked-input-interactive/masked-input-interactive.component';
import { MaskedInputApiComponent } from './masked-input-api/masked-input-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-masked-input-docs',
    imports: [
        MaskedInputOverviewComponent,
        MaskedInputInteractiveComponent,
        MaskedInputApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './masked-input-docs.component.html',
    styleUrl: './masked-input-docs.component.css'
})
export class MaskedInputDocsComponent {
    baseService = inject(BaseService);
}
