import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
  selector: 'app-country-selector-api',
  standalone: true,
  imports: [PropTableComponent],
  templateUrl: './country-selector-api.component.html'
})
export class CountrySelectorApiComponent {
  props: PropEntry[] = [
    { name: 'placeholder', description: 'The placeholder text when no country is selected.', type: 'string', default: "'Select country'" },
    { name: 'size', description: 'The size of the component.', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'" },
    { name: 'defaultCountryCode', description: 'The initial country code (ISO Alpha-2).', type: 'string', default: "'GH'" },
    { name: 'returnValue', description: 'What data to emit through ngModel.', type: "'object' | 'isoAlpha2' | 'dialCode' | 'name'", default: "'isoAlpha2'" },
    { name: 'disabled', description: 'Whether the component is disabled.', type: 'boolean', default: 'false' },
    { name: 'readonly', description: 'Whether the component is readonly.', type: 'boolean', default: 'false' },
    { name: 'class', description: 'Additional CSS classes for the trigger button.', type: 'string', default: "''" }
  ];

  events: PropEntry[] = [
    { name: 'onSelect', description: 'Emitted when a country is selected.', type: 'EventEmitter<any>', default: '-' }
  ];
}
