import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-otp-api',
    imports: [PropTableComponent],
    templateUrl: './otp-api.component.html'
})
export class OtpApiComponent {
    otpProps: PropEntry[] = [
        { name: 'length', description: 'Total number of characters.', type: 'number', default: '6' },
        { name: 'auto', description: 'Automated slot generation mode.', type: 'boolean', default: 'false' },
        { name: 'disabled', description: 'Disables all inputs.', type: 'boolean', default: 'false' }
    ];

    slotProps: PropEntry[] = [
        { name: 'char', description: 'The character to display.', type: 'string', default: "''" },
        { name: 'isActive', description: 'Whether the slot is currently focused/active.', type: 'boolean', default: 'false' },
        { name: 'isFirst', description: 'Applies left-rounded corners.', type: 'boolean', default: 'false' },
        { name: 'isLast', description: 'Applies right-rounded corners.', type: 'boolean', default: 'false' }
    ];
}
