import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { ButtonGroupComponent } from '../../../../../../tolle/src/lib/button-group.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';

@Component({
    selector: 'app-button-group-interactive',
    imports: [
        CommonModule,
        FormsModule,
        ButtonComponent,
        ButtonGroupComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <tolle-button-group>
            <tolle-button [variant]="variant" [size]="size">One</tolle-button>
            <tolle-button [variant]="variant" [size]="size">Two</tolle-button>
            <tolle-button [variant]="variant" [size]="size">Three</tolle-button>
          </tolle-button-group>
        </div>

        <div controls class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Variant</label>
            <tolle-select [(ngModel)]="variant" placeholder="Select variant">
              <tolle-select-item value="default">Default</tolle-select-item>
              <tolle-select-item value="secondary">Secondary</tolle-select-item>
              <tolle-select-item value="outline">Outline</tolle-select-item>
              <tolle-select-item value="destructive">Destructive</tolle-select-item>
            </tolle-select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Size</label>
            <tolle-select [(ngModel)]="size" placeholder="Select size">
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
export class ButtonGroupInteractiveComponent {
  variant: any = 'outline';
  size: any = 'default';

  get playgroundCode() {
    const variantAttr = this.variant !== 'default' ? ` variant="${this.variant}"` : '';
    const sizeAttr = this.size !== 'default' ? ` size="${this.size}"` : '';

    return `<tolle-button-group>
  <tolle-button${variantAttr}${sizeAttr}>One</tolle-button>
  <tolle-button${variantAttr}${sizeAttr}>Two</tolle-button>
  <tolle-button${variantAttr}${sizeAttr}>Three</tolle-button>
</tolle-button-group>`;
  }
}
