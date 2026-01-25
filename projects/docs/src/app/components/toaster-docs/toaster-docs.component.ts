import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../shared/base.service';
import { ToasterOverviewComponent } from './toaster-overview/toaster-overview.component';
import { ToasterInteractiveComponent } from './toaster-interactive/toaster-interactive.component';
import { ToasterApiComponent } from './toaster-api/toaster-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-toaster-docs',
    standalone: true,
    imports: [
        CommonModule,
        ToasterOverviewComponent,
        ToasterInteractiveComponent,
        ToasterApiComponent,
        DocsWrapperComponent

    ],
    templateUrl: './toaster-docs.component.html',
    styleUrl: './toaster-docs.component.css'
})
export class ToasterDocsComponent {
    baseService = inject(BaseService);
}
