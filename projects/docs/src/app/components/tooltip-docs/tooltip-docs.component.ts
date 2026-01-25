import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../shared/base.service';
import { TooltipOverviewComponent } from './tooltip-overview/tooltip-overview.component';
import { TooltipInteractiveComponent } from './tooltip-interactive/tooltip-interactive.component';
import { TooltipApiComponent } from './tooltip-api/tooltip-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-tooltip-docs',
    standalone: true,
    imports: [
        CommonModule,
        TooltipOverviewComponent,
        TooltipInteractiveComponent,
        TooltipApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './tooltip-docs.component.html',
    styleUrl: './tooltip-docs.component.css'
})
export class TooltipDocsComponent {
    baseService = inject(BaseService);
}
