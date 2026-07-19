import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComboboxComponent, ComboboxOption } from '../../../../../../tolle/src/lib/combobox.component';

@Component({
    selector: 'app-basic-combobox',
    standalone: true,
    imports: [CommonModule, FormsModule, ComboboxComponent],
    templateUrl: './basic-combobox.component.html'
})
export class BasicComboboxComponent {
    frameworks: ComboboxOption[] = [
        { label: 'Angular', value: 'angular' },
        { label: 'React', value: 'react' },
        { label: 'Vue', value: 'vue' },
        { label: 'Svelte', value: 'svelte' },
        { label: 'Solid', value: 'solid' },
        { label: 'Ember', value: 'ember', disabled: true }
    ];

    framework: string | null = null;
}
