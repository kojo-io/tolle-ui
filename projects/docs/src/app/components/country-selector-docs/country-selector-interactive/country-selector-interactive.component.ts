import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CountrySelectorComponent } from '../../../../../../tolle/src/lib/country-selector.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
  selector: 'app-country-selector-interactive',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CountrySelectorComponent,
    SelectComponent,
    SelectItemComponent,
    SwitchComponent,
    PlaygroundComponent
  ],
  templateUrl: './country-selector-interactive.component.html'
})
export class CountrySelectorInteractiveComponent {
  selectedIso = 'GH';
  size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  returnValue: 'object' | 'isoAlpha2' | 'dialCode' | 'name' = 'isoAlpha2';
  showName = true;
  label = 'Select Country';
  hint = 'Please select your country of residence';
  error = false;
  errorMessage = 'This field is required';
  disabled = false;
  readonly = false;

  get playgroundCode(): string {
    return `<tolle-country-selector
  [(ngModel)]="value"
  [label]="${this.label ? `'${this.label}'` : 'null'}"
  [hint]="${this.hint ? `'${this.hint}'` : 'null'}"
  [error]="${this.error}"
  [errorMessage]="${this.error ? `'${this.errorMessage}'` : 'null'}"
  size="${this.size}"
  returnValue="${this.returnValue}"
  [showName]="${this.showName}"
  [disabled]="${this.disabled}"
  [readonly]="${this.readonly}"
></tolle-country-selector>`;
  }
}
