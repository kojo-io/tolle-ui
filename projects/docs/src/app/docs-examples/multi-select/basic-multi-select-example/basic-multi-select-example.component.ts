import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../../tolle/src/lib/multi-select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';

@Component({
    selector: 'app-basic-multi-select-example',
    imports: [CommonModule, FormsModule, MultiSelectComponent, SelectItemComponent],
    template: `
    <div class="w-full max-w-sm space-y-4">
      <tolle-multi-select [(ngModel)]="selectedFramworks" placeholder="Select frameworks...">
        <tolle-select-item value="angular">Angular</tolle-select-item>
        <tolle-select-item value="react">React</tolle-select-item>
        <tolle-select-item value="vue">Vue</tolle-select-item>
        <tolle-select-item value="svelte">Svelte</tolle-select-item>
        <tolle-select-item value="ember">Ember</tolle-select-item>
      </tolle-multi-select>

      <div class="text-sm text-muted-foreground">
        Selected: {{ selectedFramworks | json }}
      </div>
    </div>
  `
})
export class BasicMultiSelectExampleComponent {
  selectedFramworks = ['angular'];
}
