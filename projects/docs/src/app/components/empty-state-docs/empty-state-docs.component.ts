import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateOverviewComponent } from './empty-state-overview/empty-state-overview.component';
import { EmptyStateInteractiveComponent } from './empty-state-interactive/empty-state-interactive.component';
import { EmptyStateApiComponent } from './empty-state-api/empty-state-api.component';
import { BaseService } from '../../shared/base.service';

@Component({
    selector: 'app-empty-state-docs',
    standalone: true,
    imports: [
        CommonModule,
        EmptyStateOverviewComponent,
        EmptyStateInteractiveComponent,
        EmptyStateApiComponent
    ],
    templateUrl: './empty-state-docs.component.html'
})
export class EmptyStateDocsComponent {
    baseService = inject(BaseService);
}
