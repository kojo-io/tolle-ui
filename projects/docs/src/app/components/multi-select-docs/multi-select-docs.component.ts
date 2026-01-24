import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { MultiSelectOverviewComponent } from './multi-select-overview/multi-select-overview.component';
import { MultiSelectInteractiveComponent } from './multi-select-interactive/multi-select-interactive.component';
import { MultiSelectApiComponent } from './multi-select-api/multi-select-api.component';

@Component({
    selector: 'app-multi-select-docs',
    standalone: true,
    imports: [
        MultiSelectOverviewComponent,
        MultiSelectInteractiveComponent,
        MultiSelectApiComponent
    ],
    templateUrl: './multi-select-docs.component.html',
    styleUrl: './multi-select-docs.component.css'
})
export class MultiSelectDocsComponent {
    baseService = inject(BaseService);
}
