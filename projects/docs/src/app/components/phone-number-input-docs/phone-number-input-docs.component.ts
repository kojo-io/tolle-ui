import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { PhoneNumberInputOverviewComponent } from './phone-number-input-overview/phone-number-input-overview.component';
import { PhoneNumberInputInteractiveComponent } from './phone-number-input-interactive/phone-number-input-interactive.component';
import { PhoneNumberInputApiComponent } from './phone-number-input-api/phone-number-input-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';

@Component({
    selector: 'app-phone-number-input-docs',
    standalone: true,
    imports: [
        PhoneNumberInputOverviewComponent,
        PhoneNumberInputInteractiveComponent,
        PhoneNumberInputApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './phone-number-input-docs.component.html',
    styles: [`
    :host { display: block; }
  `]
})
export class PhoneNumberInputDocsComponent {
    baseService = inject(BaseService);
}
