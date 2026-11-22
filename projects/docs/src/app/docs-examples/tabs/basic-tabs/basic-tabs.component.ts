import { Component } from '@angular/core';
import {
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
} from '../../../../../../tolle/src/lib/tabs.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
  selector: 'app-basic-tabs',
  imports: [TabsComponent, TabsListComponent, TabsTriggerComponent, TabsContentComponent, InputComponent, ButtonComponent],
  template: `
    <!-- [(value)] keeps the active tab in your state; use defaultValue for uncontrolled tabs. -->
    <tolle-tabs [(value)]="tab" class="w-full max-w-md">
      <tolle-tabs-list>
        <tolle-tabs-trigger value="account">Account</tolle-tabs-trigger>
        <tolle-tabs-trigger value="password">Password</tolle-tabs-trigger>
      </tolle-tabs-list>

      <tolle-tabs-content value="account">
        <div class="grid gap-3 pt-4">
          <tolle-input label="Name" placeholder="Ada Lovelace"></tolle-input>
          <tolle-button class="w-fit">Save account</tolle-button>
        </div>
      </tolle-tabs-content>

      <tolle-tabs-content value="password">
        <div class="grid gap-3 pt-4">
          <tolle-input label="New password" type="password"></tolle-input>
          <tolle-button class="w-fit">Update password</tolle-button>
        </div>
      </tolle-tabs-content>
    </tolle-tabs>

    <p class="mt-4 text-sm text-muted-foreground">Active tab: {{ tab }}</p>
  `,
})
export class BasicTabsComponent {
  tab = 'account';
}
