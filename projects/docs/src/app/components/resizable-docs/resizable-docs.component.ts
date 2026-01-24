import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { ResizableOverviewComponent } from './resizable-overview/resizable-overview.component';
import { ResizableInteractiveComponent } from './resizable-interactive/resizable-interactive.component';
import { ResizableApiComponent } from './resizable-api/resizable-api.component';

@Component({
    selector: 'app-resizable-docs',
    standalone: true,
    imports: [
        ResizableOverviewComponent,
        ResizableInteractiveComponent,
        ResizableApiComponent
    ],
    templateUrl: './resizable-docs.component.html',
    styleUrl: './resizable-docs.component.css'
})
export class ResizableDocsComponent {
    baseService = inject(BaseService);
}
