import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';

@Component({
    selector: 'app-basic-select-example',
    imports: [CommonModule, FormsModule, SelectComponent, SelectItemComponent],
    template: `
    <div class="w-full max-w-[200px] space-y-4">
      <tolle-select [(ngModel)]="selectedFruit" placeholder="Select a fruit">
        <tolle-select-item value="apple">Apple</tolle-select-item>
        <tolle-select-item value="banana">Banana</tolle-select-item>
        <tolle-select-item value="orange">Orange</tolle-select-item>
        <tolle-select-item value="grape">Grape</tolle-select-item>
      </tolle-select>

      <div class="text-sm text-muted-foreground">
        Selected: {{ selectedFruit || 'None' }}
      </div>
    </div>
  `
})
export class BasicSelectExampleComponent {
    selectedFruit = '';
}
