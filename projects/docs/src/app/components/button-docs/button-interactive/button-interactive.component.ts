import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';

@Component({
  selector: 'app-button-interactive',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    PlaygroundComponent,
    SelectComponent,
    SelectItemComponent,
    SwitchComponent,
    InputComponent,
    LabelComponent
  ],
  template: `
    <section class="mb-16" id="playground">
      <h2 class="mb-6 scroll-m-20 text-xl font-semibold tracking-tight">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview class="flex items-center justify-center">
          <tolle-button [variant]="variant" [size]="size" [busy]="isBusy" [disabled]="isDisabled">
            {{ label }}
          </tolle-button>
        </div>

        <div controls class="space-y-5">
          <div class="space-y-1.5">
            <tolle-label>Label</tolle-label>
            <tolle-input [(ngModel)]="label" size="sm" placeholder="Button text" />
          </div>

          <div class="space-y-1.5">
            <tolle-label>Variant</tolle-label>
            <tolle-select [(ngModel)]="variant" size="sm">
              <tolle-select-item value="default">Default</tolle-select-item>
              <tolle-select-item value="secondary">Secondary</tolle-select-item>
              <tolle-select-item value="outline">Outline</tolle-select-item>
              <tolle-select-item value="ghost">Ghost</tolle-select-item>
              <tolle-select-item value="link">Link</tolle-select-item>
              <tolle-select-item value="destructive">Destructive</tolle-select-item>
            </tolle-select>
          </div>

          <div class="space-y-1.5">
            <tolle-label>Size</tolle-label>
            <tolle-select [(ngModel)]="size" size="sm">
              <tolle-select-item value="default">Default</tolle-select-item>
              <tolle-select-item value="xs">Extra small</tolle-select-item>
              <tolle-select-item value="sm">Small</tolle-select-item>
              <tolle-select-item value="lg">Large</tolle-select-item>
              <tolle-select-item value="icon">Icon</tolle-select-item>
            </tolle-select>
          </div>

          <label class="flex items-center justify-between text-sm font-medium">
            <span>Busy</span>
            <tolle-switch [(ngModel)]="isBusy" size="sm" />
          </label>

          <label class="flex items-center justify-between text-sm font-medium">
            <span>Disabled</span>
            <tolle-switch [(ngModel)]="isDisabled" size="sm" />
          </label>
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
