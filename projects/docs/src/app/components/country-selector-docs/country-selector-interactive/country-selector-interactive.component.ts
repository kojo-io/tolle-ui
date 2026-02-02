import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CountrySelectorComponent } from '../../../../../../tolle/src/public-api';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';

@Component({
    selector: 'app-country-selector-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CountrySelectorComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent,
        SwitchComponent
    ],
    templateUrl: './country-selector-interactive.component.html'
})
export class CountrySelectorInteractiveComponent {
    size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
    returnValue: 'isoAlpha2' | 'dialCode' | 'name' | 'object' = 'isoAlpha2';
    showName = true;
    disabled = false;
    readonly = false;

    selectedCountryValue = 'GH';

    get playgroundCode(): string {
        return `<tolle-country-selector
  [(ngModel)]="value"
  [size]="${this.size}"
  [returnValue]="${this.returnValue}"
  [showName]="${this.showName}"
  [disabled]="${this.disabled}"
  [readonly]="${this.readonly}"
></tolle-country-selector>`;
    }
}
