import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { SegmentOverviewComponent } from './segment-overview/segment-overview.component';
import { SegmentInteractiveComponent } from './segment-interactive/segment-interactive.component';
import { SegmentApiComponent } from './segment-api/segment-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-segment-docs',
    standalone: true,
    imports: [
        SegmentOverviewComponent,
        SegmentInteractiveComponent,
        SegmentApiComponent,
        DocsWrapperComponent

    ],
    templateUrl: './segment-docs.component.html',
    styleUrl: './segment-docs.component.css'
})
export class SegmentDocsComponent {
    baseService = inject(BaseService);
}
