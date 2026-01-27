import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TabsComponent, TabsListComponent, TabsTriggerComponent, TabsContentComponent } from '../../../../../../tolle/src/lib/tabs.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { CardComponent } from '../../../../../../tolle/src/lib/card.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';

@Component({
    selector: 'app-tabs-interactive',
    imports: [
    FormsModule,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent,
    PlaygroundComponent,
    CardComponent,
    ButtonComponent,
    InputComponent,
    LabelComponent,
    SelectComponent,
    SelectItemComponent
],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <tolle-tabs defaultValue="account" class="w-[400px]">
            <tolle-tabs-list 
              [class]="variant === 'default' ? 'grid w-full grid-cols-2' : 'flex w-full'" 
              [variant]="variant"
            >
              <tolle-tabs-trigger value="account">Account</tolle-tabs-trigger>
              <tolle-tabs-trigger value="password">Password</tolle-tabs-trigger>
            </tolle-tabs-list>
            <tolle-tabs-content value="account">
              <tolle-card class="p-6">
                <div class="space-y-4">
                  <div class="space-y-2">
                    <h3 class="text-lg font-semibold leading-none tracking-tight">Account</h3>
                    <p class="text-sm text-muted-foreground">Make changes to your account here. Click save when you're done.</p>
                  </div>
                  <div class="space-y-2">
                    <tolle-label for="name">Name</tolle-label>
                    <tolle-input id="name" defaultValue="Pedro Duarte" />
                  </div>
                  <div class="space-y-2">
                    <tolle-label for="username">Username</tolle-label>
                    <tolle-input id="username" defaultValue="@peduarte" />
                  </div>
                  <div class="pt-2">
                    <tolle-button class="w-full">Save changes</tolle-button>
                  </div>
                </div>
              </tolle-card>
            </tolle-tabs-content>
            <tolle-tabs-content value="password">
              <tolle-card class="p-6">
                <div class="space-y-4">
                  <div class="space-y-2">
                    <h3 class="text-lg font-semibold leading-none tracking-tight">Password</h3>
                    <p class="text-sm text-muted-foreground">Change your password here. After saving, you'll be logged out.</p>
                  </div>
                  <div class="space-y-2">
                    <tolle-label for="current">Current password</tolle-label>
                    <tolle-input id="current" type="password" />
                  </div>
                  <div class="space-y-2">
                    <tolle-label for="new">New password</tolle-label>
                    <tolle-input id="new" type="password" />
                  </div>
                  <div class="pt-2">
                    <tolle-button class="w-full">Save password</tolle-button>
                  </div>
                </div>
              </tolle-card>
            </tolle-tabs-content>
          </tolle-tabs>
        </div>

        <div controls class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Variant</label>
            <tolle-select [(ngModel)]="variant">
              <tolle-select-item value="default">Default</tolle-select-item>
              <tolle-select-item value="underline">Underline</tolle-select-item>
            </tolle-select>
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class TabsInteractiveComponent {
  variant: 'default' | 'underline' = 'default';

  get playgroundCode() {
    const variantAttr = this.variant === 'underline' ? ' variant="underline"' : '';
    const gridColsClass = this.variant === 'default' ? ' grid-cols-2' : '';
    return `<tolle-tabs defaultValue="account" class="w-[400px]">
  <tolle-tabs-list${variantAttr} class="grid w-full${gridColsClass}">
    <tolle-tabs-trigger value="account">Account</tolle-tabs-trigger>
    <tolle-tabs-trigger value="password">Password</tolle-tabs-trigger>
  </tolle-tabs-list>
  <tolle-tabs-content value="account">
    <tolle-card class="p-6">
      <div class="space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold leading-none tracking-tight">Account</h3>
          <p class="text-sm text-muted-foreground">Make changes to your account here.</p>
        </div>
        <div class="space-y-2">
          <tolle-label for="name">Name</tolle-label>
          <tolle-input id="name" defaultValue="Pedro Duarte" />
        </div>
        <div class="pt-2">
          <tolle-button class="w-full">Save changes</tolle-button>
        </div>
      </div>
    </tolle-card>
  </tolle-tabs-content>
  <tolle-tabs-content value="password">
    <tolle-card class="p-6">
      <div class="space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold leading-none tracking-tight">Password</h3>
          <p class="text-sm text-muted-foreground">Change your password here.</p>
        </div>
        <div class="space-y-2">
          <tolle-label for="new">New password</tolle-label>
          <tolle-input id="new" type="password" />
        </div>
        <div class="pt-2">
          <tolle-button class="w-full">Save password</tolle-button>
        </div>
      </div>
    </tolle-card>
  </tolle-tabs-content>
</tolle-tabs>`;
  }
}
