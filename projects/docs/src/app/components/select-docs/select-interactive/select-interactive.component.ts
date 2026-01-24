import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-select-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SelectComponent,
        SelectItemComponent,
        InputComponent,
        CheckboxComponent,
        PlaygroundComponent
    ],
    templateUrl: './select-interactive.component.html'
})
export class SelectInteractiveComponent {
    placeholder = 'Select an option';
    size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
    searchable = false;
    disabled = false;
    readonly = false;

    selectedValue = '';

    get playgroundCode(): string {
        const inputs = [
            this.placeholder !== 'Select an option' ? `placeholder="${this.placeholder}"` : '',
            this.size !== 'default' ? `size="${this.size}"` : '',
            this.searchable ? '[searchable]="true"' : '',
            this.disabled ? '[disabled]="true"' : '',
            this.readonly ? '[readonly]="true"' : ''
        ].filter(Boolean).join('\n  ');

        return `<tolle-select
  [(ngModel)]="selectedValue"${inputs ? '\n  ' + inputs : ''}
>
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
  <tolle-select-item value="blueberry">Blueberry</tolle-select-item>
  <tolle-select-item value="grapes">Grapes</tolle-select-item>
  <tolle-select-item value="pineapple">Pineapple</tolle-select-item>
</tolle-select>

<!-- Selected: {{ selectedValue }} -->`;
    }
}
