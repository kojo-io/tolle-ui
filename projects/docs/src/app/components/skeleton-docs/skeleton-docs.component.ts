import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { SkeletonOverviewComponent } from './skeleton-overview/skeleton-overview.component';
import { SkeletonInteractiveComponent } from './skeleton-interactive/skeleton-interactive.component';
import { SkeletonApiComponent } from './skeleton-api/skeleton-api.component';

@Component({
    selector: 'app-skeleton-docs',
    standalone: true,
    imports: [
        SkeletonOverviewComponent,
        SkeletonInteractiveComponent,
        SkeletonApiComponent
    ],
    templateUrl: './skeleton-docs.component.html',
    styleUrl: './skeleton-docs.component.css'
})
export class SkeletonDocsComponent {
    baseService = inject(BaseService);
}
