import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComboboxComponent, ComboboxOption } from '../../../../../../tolle/src/lib/combobox.component';

@Component({
    selector: 'app-combobox-sizes',
    standalone: true,
    imports: [CommonModule, FormsModule, ComboboxComponent],
    templateUrl: './combobox-sizes.component.html'
})
export class ComboboxSizesComponent {
    /** `keywords` let synonyms match without appearing in the label. */
    statuses: ComboboxOption[] = [
        { label: 'Backlog', value: 'backlog', keywords: ['todo', 'later', 'icebox'] },
        { label: 'In progress', value: 'in-progress', keywords: ['wip', 'active', 'doing'] },
        { label: 'In review', value: 'in-review', keywords: ['pr', 'qa', 'checking'] },
        { label: 'Done', value: 'done', keywords: ['shipped', 'closed', 'complete'] },
        { label: 'Cancelled', value: 'cancelled', keywords: ['dropped', 'abandoned'] }
    ];

    small: string | null = null;
    medium: string | null = null;
    large: string | null = null;
    required: string | null = null;
}
