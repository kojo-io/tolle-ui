import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { AvatarOverviewComponent } from './avatar-overview/avatar-overview.component';
import { AvatarInteractiveComponent } from './avatar-interactive/avatar-interactive.component';
import { AvatarExamplesComponent } from './avatar-examples/avatar-examples.component';
import { AvatarApiComponent } from './avatar-api/avatar-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-avatar-docs',
    imports: [
        AvatarOverviewComponent,
        AvatarInteractiveComponent,
        AvatarExamplesComponent,
        AvatarApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './avatar-docs.component.html',
    styleUrl: './avatar-docs.component.css'
})
export class AvatarDocsComponent {
  baseService = inject(BaseService);
}
