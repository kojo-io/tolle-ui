import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../shared/base.service';
import { AspectRatioOverviewComponent } from './aspect-ratio-overview/aspect-ratio-overview.component';
import { AspectRatioInteractiveComponent } from './aspect-ratio-interactive/aspect-ratio-interactive.component';
import { AspectRatioApiComponent } from './aspect-ratio-api/aspect-ratio-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-aspect-ratio-docs',
    imports: [
        CommonModule,
        AspectRatioOverviewComponent,
        AspectRatioInteractiveComponent,
        AspectRatioApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './aspect-ratio-docs.component.html',
    styleUrl: './aspect-ratio-docs.component.css'
})
export class AspectRatioDocsComponent {
    baseService = inject(BaseService);
}
