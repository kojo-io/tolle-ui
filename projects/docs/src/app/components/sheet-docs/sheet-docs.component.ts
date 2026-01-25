import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SheetOverviewComponent } from './sheet-overview/sheet-overview.component';
import { SheetInteractiveComponent } from './sheet-interactive/sheet-interactive.component';
import { SheetApiComponent } from './sheet-api/sheet-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BaseService } from '../../shared/base.service';

@Component({
    selector: 'app-sheet-docs',
    standalone: true,
    imports: [
        CommonModule,
        SheetOverviewComponent,
        SheetInteractiveComponent,
        SheetApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './sheet-docs.component.html'
})
export class SheetDocsComponent {
    baseService = inject(BaseService);
}
