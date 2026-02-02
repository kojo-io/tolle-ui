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
    componentProps: PropEntry[] = [
        { name: 'placeholder', description: 'Text to display when the input is empty.', type: 'string', default: "'Phone number'" },
        { name: 'size', description: 'The size of the input.', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'" },
        { name: 'defaultCountryCode', description: 'The ISO alpha-2 code of the country to select by default.', type: 'string', default: "'GH'" },
        { name: 'dataType', description: 'The format of the value emitted by ngModel.', type: "'NumberOnly' | 'FullObject'", default: "'FullObject'" },
        { name: 'mask', description: 'The input mask for the phone number.', type: 'string', default: "'(000) 000-0000'" },
        { name: 'disabled', description: 'Whether the component is disabled.', type: 'boolean', default: 'false' },
        { name: 'readonly', description: 'Whether the component is readonly.', type: 'boolean', default: 'false' },
        { name: 'class', description: 'Additional CSS classes for the container.', type: 'string', default: "''" }
    ];

    componentEvents: PropEntry[] = [
        { name: 'onSelect', description: 'Emitted when a valid phone number is parsed.', type: 'EventEmitter<any>', default: '-' }
    ];
}
