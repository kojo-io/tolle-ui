import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleGroupComponent, ToggleGroupItemComponent } from '../../../../../../tolle/src/lib/toggle-group.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';

@Component({
    selector: 'app-toggle-group-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToggleGroupComponent,
        ToggleGroupItemComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <tolle-toggle-group
            [type]="type"
            [variant]="variant"
            [size]="size"
            [(ngModel)]="value"
          >
            <tolle-toggle-group-item value="bold">B</tolle-toggle-group-item>
            <tolle-toggle-group-item value="italic">I</tolle-toggle-group-item>
            <tolle-toggle-group-item value="underline">U</tolle-toggle-group-item>
          </tolle-toggle-group>
        </div>

        <div controls class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Type</label>
            <tolle-select [(ngModel)]="type">
              <tolle-select-item value="single">Single</tolle-select-item>
              <tolle-select-item value="multiple">Multiple</tolle-select-item>
            </tolle-select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Variant</label>
            <tolle-select [(ngModel)]="variant">
              <tolle-select-item value="default">Default</tolle-select-item>
              <tolle-select-item value="outline">Outline</tolle-select-item>
            </tolle-select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Size</label>
            <tolle-select [(ngModel)]="size">
              <tolle-select-item value="sm">Small</tolle-select-item>
              <tolle-select-item value="default">Default</tolle-select-item>
              <tolle-select-item value="lg">Large</tolle-select-item>
            </tolle-select>
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class ToggleGroupInteractiveComponent {
    type: 'single' | 'multiple' = 'single';
    variant: 'default' | 'outline' = 'default';
    size: 'default' | 'sm' | 'lg' = 'default';
    value: any = 'bold';

    get playgroundCode() {
        const typeAttr = this.type !== 'single' ? ` type="${this.type}"` : '';
        const variantAttr = this.variant !== 'default' ? ` variant="${this.variant}"` : '';
        const sizeAttr = this.size !== 'default' ? ` size="${this.size}"` : '';

        return `<tolle-toggle-group${typeAttr}${variantAttr}${sizeAttr}>
  <tolle-toggle-group-item value="bold">B</tolle-toggle-group-item>
  <tolle-toggle-group-item value="italic">I</tolle-toggle-group-item>
  <tolle-toggle-group-item value="underline">U</tolle-toggle-group-item>
</tolle-toggle-group>`;
    }
}
