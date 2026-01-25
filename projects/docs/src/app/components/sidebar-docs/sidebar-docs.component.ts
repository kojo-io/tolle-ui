import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { SidebarOverviewComponent } from './sidebar-overview/sidebar-overview.component';
import { SidebarInteractiveComponent } from './sidebar-interactive/sidebar-interactive.component';
import { SidebarApiComponent } from './sidebar-api/sidebar-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-sidebar-docs',
    standalone: true,
    imports: [
        SidebarOverviewComponent,
        SidebarInteractiveComponent,
        SidebarApiComponent,
        DocsWrapperComponent

    ],
    templateUrl: './sidebar-docs.component.html',
    styleUrl: './sidebar-docs.component.css'
})
export class SidebarDocsComponent {
    baseService = inject(BaseService);
}
