import { Component, inject } from '@angular/core';

import { BaseService } from '../../shared/base.service';
import { ContextMenuOverviewComponent } from './context-menu-overview/context-menu-overview.component';
import { ContextMenuInteractiveComponent } from './context-menu-interactive/context-menu-interactive.component';
import { ContextMenuApiComponent } from './context-menu-api/context-menu-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-context-menu-docs',
    imports: [
    ContextMenuOverviewComponent,
    ContextMenuInteractiveComponent,
    ContextMenuApiComponent,
    DocsWrapperComponent
],
    templateUrl: './context-menu-docs.component.html'
})
export class ContextMenuDocsComponent {
    baseService = inject(BaseService);
}
