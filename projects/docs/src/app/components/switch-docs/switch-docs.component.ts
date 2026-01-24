import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchOverviewComponent } from './switch-overview/switch-overview.component';
import { SwitchInteractiveComponent } from './switch-interactive/switch-interactive.component';
import { SwitchApiComponent } from './switch-api/switch-api.component';
import { BaseService } from '../../shared/base.service';

@Component({
    selector: 'app-switch-docs',
    standalone: true,
    imports: [
        CommonModule,
        SwitchOverviewComponent,
        SwitchInteractiveComponent,
        SwitchApiComponent
    ],
    templateUrl: './switch-docs.component.html',
    styleUrls: ['./switch-docs.component.css']
})
export class SwitchDocsComponent {
    baseService = inject(BaseService);
}
