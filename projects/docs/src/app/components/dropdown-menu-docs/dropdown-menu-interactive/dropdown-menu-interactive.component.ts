import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownMenuComponent } from '../../../../../../tolle/src/lib/dropdown-menu.component';
import { DropdownTriggerDirective } from '../../../../../../tolle/src/lib/dropdown-trigger.directive';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';

@Component({
    selector: 'app-dropdown-menu-interactive',
    imports: [
        CommonModule,
        FormsModule,
        DropdownMenuComponent,
        DropdownTriggerDirective,
        ButtonComponent,
        PlaygroundComponent,
        SwitchComponent,
        SelectComponent,
        SelectItemComponent
    ],
    template: `
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-foreground">Interactive Playground</h2>
      
      <app-playground [code]="codeSnippet">
        <div preview class="flex items-center justify-center min-h-[300px]">
          <tolle-button [variant]="variant" [size]="size" [tolleDropdownTrigger]="menu" [disabled]="disabled">
            {{ label }}
            <i class="ri-arrow-down-s-line ml-2"></i>
          </tolle-button>

          <tolle-dropdown-menu #menu>
            <div class="flex flex-col p-1">
              <button class="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors">
                <i class="ri-user-line"></i>
                Profile
              </button>
              <button class="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors">
                <i class="ri-settings-4-line"></i>
                Settings
              </button>
              <div class="my-1 h-px bg-border"></div>
              <button class="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-destructive hover:bg-destructive/10 rounded-sm transition-colors">
                <i class="ri-logout-box-line"></i>
                Logout
              </button>
            </div>
          </tolle-dropdown-menu>
        </div>

        <div controls class="grid gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Button Label</label>
            <input 
              type="text" 
              [(ngModel)]="label" 
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm font-medium leading-none text-foreground">Disabled</span>
            <tolle-switch [(ngModel)]="disabled"></tolle-switch>
          </div>

          <div class="space-y-2">
            <h3 class="text-sm font-medium leading-none text-foreground">Variant</h3>
            <tolle-select [(ngModel)]="variant" size="sm">
              <tolle-select-item value="default">Default</tolle-select-item>
              <tolle-select-item value="secondary">Secondary</tolle-select-item>
              <tolle-select-item value="destructive">Destructive</tolle-select-item>
              <tolle-select-item value="outline">Outline</tolle-select-item>
              <tolle-select-item value="ghost">Ghost</tolle-select-item>
              <tolle-select-item value="link">Link</tolle-select-item>
            </tolle-select>
          </div>

          <div class="space-y-2">
            <h3 class="text-sm font-medium leading-none text-foreground">Size</h3>
            <tolle-select [(ngModel)]="size" size="sm">
              <tolle-select-item value="xs">Extra Small</tolle-select-item>
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
export class DropdownMenuInteractiveComponent {
  label = 'Menu';
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' = 'outline';
  size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  disabled = false;

  get codeSnippet(): string {
    const disabledAttr = this.disabled ? ' [disabled]="true"' : '';
    return `<tolle-button 
  variant="${this.variant}" 
  size="${this.size}"${disabledAttr} 
  [tolleDropdownTrigger]="menu"
>
  ${this.label}
</tolle-button>

<tolle-dropdown-menu #menu>
  <div class="flex flex-col p-1">
    <button class="...">Profile</button>
    <button class="...">Settings</button>
    <div class="my-1 h-px bg-border"></div>
    <button class="...">Logout</button>
  </div>
</tolle-dropdown-menu>`;
  }
}
