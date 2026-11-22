import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { PopoverOverviewComponent } from './popover-overview/popover-overview.component';
import { PopoverInteractiveComponent } from './popover-interactive/popover-interactive.component';
import { PopoverApiComponent } from './popover-api/popover-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-popover-docs',
    imports: [
        PopoverOverviewComponent,
        PopoverInteractiveComponent,
        PopoverApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './popover-docs.component.html',
    styleUrl: './popover-docs.component.css'
})
export class PopoverDocsComponent {
    baseService = inject(BaseService);
}
