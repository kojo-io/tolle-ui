import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NativeSelectComponent, NativeSelectOption } from '../../../../../../tolle/src/lib/native-select.component';

@Component({
    selector: 'app-native-select-forms',
    standalone: true,
    imports: [FormsModule, NativeSelectComponent],
    templateUrl: './native-select-forms.component.html'
})
export class NativeSelectFormsComponent {
    // Numeric values survive the round trip — the component maps the DOM's
    // stringified value back to the original option value.
    quantities: NativeSelectOption[] = [
        { label: '1 seat', value: 1 },
        { label: '2 seats', value: 2 },
        { label: '5 seats', value: 5 },
        { label: '10 seats', value: 10 }
    ];

    seats: number | null = 2;

    get valueType(): string {
        return typeof this.seats;
    }
}
