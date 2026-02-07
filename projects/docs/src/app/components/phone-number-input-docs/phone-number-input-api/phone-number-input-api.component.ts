import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-phone-number-input-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './phone-number-input-api.component.html'
})
export class PhoneNumberInputApiComponent {
    props: PropEntry[] = [
        { name: 'label', description: 'The label text for the field.', type: 'string', default: "''" },
        { name: 'hint', description: 'Helpful hint text displayed below the field.', type: 'string', default: "''" },
        { name: 'errorMessage', description: 'Error message to display when the field is in an error state.', type: 'string', default: "''" },
        { name: 'error', description: 'Whether the field is in an error state.', type: 'boolean', default: 'false' },
        { name: 'id', description: 'The unique ID for the component.', type: 'string', default: 'auto-generated' },
        { name: 'placeholder', description: 'The placeholder text for the phone number input.', type: 'string', default: "'Phone number'" },
        { name: 'size', description: 'The size of the component.', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'" },
        { name: 'defaultCountryCode', description: 'The initial country code for the prefix selector (ISO Alpha-2).', type: 'string', default: "'GH'" },
        { name: 'dataType', description: 'What data format to emit through ngModel.', type: "'FullObject' | 'NumberOnly'", default: "'FullObject'" },
        { name: 'enableCountrySelector', description: 'Whether the country selector is enabled (when false, it appears disabled).', type: 'boolean', default: 'true' },
        { name: 'disabled', description: 'Whether the component is disabled.', type: 'boolean', default: 'false' },
        { name: 'readonly', description: 'Whether the component is readonly.', type: 'boolean', default: 'false' },
        { name: 'class', description: 'Additional CSS classes for the container.', type: 'string', default: "''" }
    ];

    events: PropEntry[] = [
        { name: 'onSelect', description: 'Emitted when a valid phone number is entered or country is changed.', type: 'EventEmitter<any>', default: '-' }
    ];
}
