import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../../tolle/src/lib/multi-select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-multi-select-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MultiSelectComponent,
        SelectItemComponent,
        InputComponent,
        CheckboxComponent,
        SelectComponent,
        PlaygroundComponent
    ],
    templateUrl: './multi-select-interactive.component.html'
})
export class MultiSelectInteractiveComponent {
    placeholder = 'Select options...';
    size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
    searchable = false;
    disabled = false;
    maxSelections: number | undefined = undefined;
    maxDisplayItems = 3;
    error = false;

    selectedValues: string[] = [];

    get playgroundCode(): string {
        const inputs = [
            this.placeholder !== 'Select options...' ? `placeholder="${this.placeholder}"` : '',
            this.size !== 'default' ? `size="${this.size}"` : '',
            this.searchable ? '[searchable]="true"' : '',
            this.disabled ? '[disabled]="true"' : '',
            this.maxSelections ? `[maxSelections]="${this.maxSelections}"` : '',
            this.maxDisplayItems !== 3 ? `[maxDisplayItems]="${this.maxDisplayItems}"` : '',
            this.error ? '[error]="true"' : ''
        ].filter(Boolean).join('\n  ');

        return `<tolle-multi-select
  [(ngModel)]="selectedValues"${inputs ? '\n  ' + inputs : ''}
>
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
  <tolle-select-item value="blueberry">Blueberry</tolle-select-item>
  <tolle-select-item value="grapes">Grapes</tolle-select-item>
  <tolle-select-item value="pineapple">Pineapple</tolle-select-item>
</tolle-multi-select>

<!-- Selected: {{ selectedValues | json }} -->`;
    }
}
