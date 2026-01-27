import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';

@Component({
    selector: 'app-button-interactive',
    imports: [
        CommonModule,
        FormsModule,
        ButtonComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent,
        CheckboxComponent
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <tolle-button 
            [variant]="variant" 
            [size]="size" 
            [busy]="isBusy" 
            [disabled]="isDisabled">
            {{ label }}
          </tolle-button>
        </div>

        <div controls class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Label</label>
            <input 
              type="text" 
              [(ngModel)]="label" 
              class="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Variant</label>
            <tolle-select [(ngModel)]="variant" placeholder="Select variant">
              <tolle-select-item value="default">Default</tolle-select-item>
              <tolle-select-item value="secondary">Secondary</tolle-select-item>
              <tolle-select-item value="outline">Outline</tolle-select-item>
              <tolle-select-item value="ghost">Ghost</tolle-select-item>
              <tolle-select-item value="link">Link</tolle-select-item>
              <tolle-select-item value="destructive">Destructive</tolle-select-item>
            </tolle-select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Size</label>
            <tolle-select [(ngModel)]="size" placeholder="Select size">
              <tolle-select-item value="default">Default</tolle-select-item>
              <tolle-select-item value="xs">Extra Small</tolle-select-item>
              <tolle-select-item value="sm">Small</tolle-select-item>
              <tolle-select-item value="lg">Large</tolle-select-item>
              <tolle-select-item value="icon">Icon</tolle-select-item>
            </tolle-select>
          </div>

          <div class="flex items-center gap-2 py-2">
            <tolle-checkbox [(ngModel)]="isBusy" size="sm"></tolle-checkbox>
            <label class="text-sm font-medium cursor-pointer" (click)="isBusy = !isBusy">Busy state</label>
          </div>

          <div class="flex items-center gap-2 py-2">
            <tolle-checkbox [(ngModel)]="isDisabled" size="sm"></tolle-checkbox>
            <label class="text-sm font-medium cursor-pointer" (click)="isDisabled = !isDisabled">Disabled</label>
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class ButtonInteractiveComponent {
  label = 'Button';
  variant: any = 'default';
  size: any = 'default';
  isBusy = false;
  isDisabled = false;

  get playgroundCode() {
    const variantAttr = this.variant !== 'default' ? ` variant="${this.variant}"` : '';
    const sizeAttr = this.size !== 'default' ? ` size="${this.size}"` : '';
    const busyAttr = this.isBusy ? ` [busy]="true"` : '';
    const disabledAttr = this.isDisabled ? ` [disabled]="true"` : '';

    return `<tolle-button${variantAttr}${sizeAttr}${busyAttr}${disabledAttr}>
  ${this.label}
</tolle-button>`;
  }
}
