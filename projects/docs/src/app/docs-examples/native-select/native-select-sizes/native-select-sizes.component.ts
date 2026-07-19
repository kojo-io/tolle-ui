import { Component } from '@angular/core';
import { NativeSelectComponent, NativeSelectOption } from '../../../../../../tolle/src/lib/native-select.component';

@Component({
    selector: 'app-native-select-sizes',
    standalone: true,
    imports: [NativeSelectComponent],
    templateUrl: './native-select-sizes.component.html'
})
export class NativeSelectSizesComponent {
    options: NativeSelectOption[] = [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' }
    ];
}
