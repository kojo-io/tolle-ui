import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ToggleComponent } from '../../../../../../tolle/src/lib/toggle.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';

@Component({
    selector: 'app-toggle-interactive',
    imports: [
    FormsModule,
    ToggleComponent,
    PlaygroundComponent,
    SelectComponent,
    SelectItemComponent
],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <tolle-toggle 
            [variant]="variant" 
            [size]="size" 
            [(pressed)]="isPressed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <path d="M6 12h9"></path>
              <path d="M11 7l5 5-5 5"></path>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          </tolle-toggle>
        </div>

        <div controls class="space-y-4">
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
              <tolle-select-item value="default">Default</tolle-select-item>
              <tolle-select-item value="sm">Small</tolle-select-item>
              <tolle-select-item value="lg">Large</tolle-select-item>
            </tolle-select>
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class ToggleInteractiveComponent {
    isPressed = false;
    variant: any = 'default';
    size: any = 'default';

    get playgroundCode() {
        const variantAttr = this.variant !== 'default' ? ` variant="${this.variant}"` : '';
        const sizeAttr = this.size !== 'default' ? ` size="${this.size}"` : '';

        return `<tolle-toggle[(pressed)]="isPressed"${variantAttr}${sizeAttr}>
  <icon-bold class="h-4 w-4" />
</tolle-toggle>`;
    }
}
