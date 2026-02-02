import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { CountrySelectorOverviewComponent } from './country-selector-overview/country-selector-overview.component';
import { CountrySelectorInteractiveComponent } from './country-selector-interactive/country-selector-interactive.component';
import { CountrySelectorApiComponent } from './country-selector-api/country-selector-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';

@Component({
    selector: 'app-country-selector-docs',
    standalone: true,
    imports: [
        CountrySelectorOverviewComponent,
        CountrySelectorInteractiveComponent,
        CountrySelectorApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './country-selector-docs.component.html',
    styles: [`
    :host { display: block; }
  `]
})
export class CountrySelectorDocsComponent {
    baseService = inject(BaseService);
}
