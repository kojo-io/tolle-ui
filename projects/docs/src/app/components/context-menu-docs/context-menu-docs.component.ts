import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../shared/base.service';
import { ContextMenuOverviewComponent } from './context-menu-overview/context-menu-overview.component';
import { ContextMenuInteractiveComponent } from './context-menu-interactive/context-menu-interactive.component';
import { ContextMenuApiComponent } from './context-menu-api/context-menu-api.component';

@Component({
    selector: 'app-context-menu-docs',
    standalone: true,
    imports: [
        CommonModule,
        ContextMenuOverviewComponent,
        ContextMenuInteractiveComponent,
        ContextMenuApiComponent
    ],
    templateUrl: './context-menu-docs.component.html'
})
export class ContextMenuDocsComponent {
    baseService = inject(BaseService);
}
