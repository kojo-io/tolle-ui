import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { AlertDialogOverviewComponent } from './alert-dialog-overview/alert-dialog-overview.component';
import { AlertDialogInteractiveComponent } from './alert-dialog-interactive/alert-dialog-interactive.component';
import { AlertDialogApiComponent } from './alert-dialog-api/alert-dialog-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-alert-dialog-docs',
    standalone: true,
    imports: [
        CommonModule,
        AlertDialogOverviewComponent,
        AlertDialogInteractiveComponent,
        AlertDialogApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './alert-dialog-docs.component.html'
})
export class AlertDialogDocsComponent implements OnInit {
    baseService = inject(BaseService);
    analytics = inject(AnalyticsService);

    ngOnInit(): void {
        this.analytics.init();
    }
}
