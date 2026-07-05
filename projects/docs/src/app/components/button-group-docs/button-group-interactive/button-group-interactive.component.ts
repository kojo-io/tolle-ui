import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { ButtonGroupComponent } from '../../../../../../tolle/src/lib/button-group.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';

@Component({
  selector: 'app-button-group-interactive',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    ButtonGroupComponent,
    PlaygroundComponent,
    SelectComponent,
    SelectItemComponent,
    LabelComponent
  ],
  template: `
    <section class="mb-16" id="playground">
      <h2 class="text-xl font-semibold tracking-tight mb-6">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <tolle-button-group>
            <tolle-button [variant]="variant" [size]="size">One</tolle-button>
            <tolle-button [variant]="variant" [size]="size">Two</tolle-button>
            <tolle-button [variant]="variant" [size]="size">Three</tolle-button>
          </tolle-button-group>
        </div>

        <div controls class="space-y-5">
          <div class="space-y-1.5">
            <tolle-label>Variant</tolle-label>
            <tolle-select [(ngModel)]="variant" size="sm">
              <tolle-select-item value="default">Default</tolle-select-item>
              <tolle-select-item value="secondary">Secondary</tolle-select-item>
              <tolle-select-item value="outline">Outline</tolle-select-item>
              <tolle-select-item value="destructive">Destructive</tolle-select-item>
            </tolle-select>
          </div>

          <div class="space-y-1.5">
            <tolle-label>Size</tolle-label>
            <tolle-select [(ngModel)]="size" size="sm">
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
