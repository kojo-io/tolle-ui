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
    componentProps: PropEntry[] = [
        { name: 'placeholder', description: 'Text to display when no country is selected.', type: 'string', default: "'Select country'" },
        { name: 'size', description: 'The size of the selector.', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'" },
        { name: 'defaultCountryCode', description: 'The ISO alpha-2 code of the country to select by default.', type: 'string', default: "'GH'" },
        { name: 'returnValue', description: 'The format of the value emitted by ngModel.', type: "'isoAlpha2' | 'dialCode' | 'name' | 'object'", default: "'isoAlpha2'" },
        { name: 'showName', description: 'Whether to show the country name in the trigger.', type: 'boolean', default: 'true' },
        { name: 'disabled', description: 'Whether the component is disabled.', type: 'boolean', default: 'false' },
        { name: 'readonly', description: 'Whether the component is readonly.', type: 'boolean', default: 'false' },
        { name: 'class', description: 'Additional CSS classes for the trigger.', type: 'string', default: "''" }
    ];

    componentEvents: PropEntry[] = [
        { name: 'onSelect', description: 'Emitted when a country is selected.', type: 'EventEmitter<any>', default: '-' }
    ];
}
