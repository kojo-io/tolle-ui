import { Component, inject } from '@angular/core';

import { SwitchOverviewComponent } from './switch-overview/switch-overview.component';
import { SwitchInteractiveComponent } from './switch-interactive/switch-interactive.component';
import { SwitchApiComponent } from './switch-api/switch-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BaseService } from '../../shared/base.service';


@Component({
    selector: 'app-switch-docs',
    imports: [
    SwitchOverviewComponent,
    SwitchInteractiveComponent,
    SwitchApiComponent,
    DocsWrapperComponent
],
    templateUrl: './switch-docs.component.html',
    styleUrls: ['./switch-docs.component.css']
})
export class SwitchDocsComponent {
    baseService = inject(BaseService);
}
