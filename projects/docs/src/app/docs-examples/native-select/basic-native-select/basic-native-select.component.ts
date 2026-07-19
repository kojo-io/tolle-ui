import { Component } from '@angular/core';
import { NativeSelectComponent, NativeSelectOption } from '../../../../../../tolle/src/lib/native-select.component';

@Component({
    selector: 'app-basic-native-select',
    standalone: true,
    imports: [NativeSelectComponent],
    templateUrl: './basic-native-select.component.html'
})
export class BasicNativeSelectComponent {
    fruits: NativeSelectOption[] = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Blueberry', value: 'blueberry' },
        { label: 'Pineapple', value: 'pineapple', disabled: true }
    ];
}
