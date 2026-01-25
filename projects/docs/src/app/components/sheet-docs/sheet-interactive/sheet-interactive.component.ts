import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import {
  SheetComponent,
  SheetTriggerComponent,
  SheetContentComponent,
  SheetHeaderComponent,
  SheetTitleComponent,
  SheetDescriptionComponent,
  SheetFooterComponent
} from '../../../../../../tolle/src/lib/sheet.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';

@Component({
  selector: 'app-sheet-interactive',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SheetComponent,
    SheetTriggerComponent,
    SheetContentComponent,
    SheetHeaderComponent,
    SheetTitleComponent,
    SheetDescriptionComponent,
    SheetFooterComponent,
    ButtonComponent,
    InputComponent,
    LabelComponent,
    SwitchComponent,
    SelectComponent,
    SelectItemComponent,
    BaseEditorComponent
  ],
  template: `
    <section class="mb-16 scroll-mt-20" id="playground">
      <h2 class="text-3xl font-bold tracking-tight mb-6 text-foreground">Interactive Playground</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 overflow-hidden shadow-sm">
        <!-- Preview Area -->
        <div class="lg:col-span-2 p-12 flex items-center justify-center bg-white dark:bg-neutral-950 min-h-[500px]">
          <tolle-sheet [hasBackdrop]="hasBackdrop">
            <tolle-sheet-trigger>
              <button tolle-button variant="outline">Open Sheet</button>
            </tolle-sheet-trigger>
            <tolle-sheet-content [side]="side" [rounded]="rounded">
              <tolle-sheet-header>
                <tolle-sheet-title>Edit profile</tolle-sheet-title>
                <tolle-sheet-description>
                  Make changes to your profile here. Click save when you're done.
                </tolle-sheet-description>
              </tolle-sheet-header>
              
              <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                  <label tolle-label for="name" class="text-right">Name</label>
                  <input tolle-input id="name" value="Pedro Duarte" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <label tolle-label for="username" class="text-right">Username</label>
                  <input tolle-input id="username" value="@peduarte" class="col-span-3" />
                </div>
              </div>
              
              <tolle-sheet-footer>
                <button tolle-button type="submit">Save changes</button>
              </tolle-sheet-footer>
            </tolle-sheet-content>
          </tolle-sheet>
        </div>

        <!-- Configuration -->
        <div class="p-6 bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800">
          <h4 class="text-sm font-semibold mb-6 uppercase tracking-wider text-muted-foreground">Configuration</h4>
          
          <div class="space-y-6">
            <div>
              <label tolle-label class="mb-2 block">Side</label>
              <tolle-select [(ngModel)]="side">
                <tolle-select-item value="top">Top</tolle-select-item>
                <tolle-select-item value="bottom">Bottom</tolle-select-item>
                <tolle-select-item value="left">Left</tolle-select-item>
                <tolle-select-item value="right">Right</tolle-select-item>
              </tolle-select>
            </div>

            <div class="flex items-center justify-between">
              <label tolle-label>Show Backdrop</label>
              <tolle-switch [(ngModel)]="hasBackdrop"></tolle-switch>
            </div>

            <div class="flex items-center justify-between">
              <label tolle-label>Rounded Corners</label>
              <tolle-switch [(ngModel)]="rounded"></tolle-switch>
            </div>
          </div>
        </div>
      </div>

      <!-- Code Block -->
      <div class="mt-8">
        <div class="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
          <app-base-editor [code]="code" language="html"></app-base-editor>
        </div>
      </div>
    </section>
  `
})
export class SheetInteractiveComponent {
  side: 'top' | 'bottom' | 'left' | 'right' = 'right';
  hasBackdrop = true;
  rounded = false;

  get code() {
    return `<tolle-sheet [hasBackdrop]="${this.hasBackdrop}">
  <tolle-sheet-trigger>
    <button tolle-button variant="outline">Open Sheet</button>
  </tolle-sheet-trigger>
  <tolle-sheet-content side="${this.side}" [rounded]="${this.rounded}">
    <tolle-sheet-header>
      <tolle-sheet-title>Edit profile</tolle-sheet-title>
      <tolle-sheet-description>
        Make changes to your profile here. Click save when you're done.
      </tolle-sheet-description>
    </tolle-sheet-header>
    <!-- Content goes here -->
    <tolle-sheet-footer>
      <button tolle-button type="submit">Save changes</button>
    </tolle-sheet-footer>
  </tolle-sheet-content>
</tolle-sheet>`;
  }
}
