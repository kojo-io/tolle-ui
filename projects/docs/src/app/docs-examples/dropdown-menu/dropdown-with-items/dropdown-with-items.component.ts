import { Component } from '@angular/core';
import { DropdownMenuComponent } from '../../../../../../tolle/src/lib/dropdown-menu.component';
import { DropdownTriggerDirective } from '../../../../../../tolle/src/lib/dropdown-trigger.directive';
import { DropdownItemComponent } from '../../../../../../tolle/src/lib/dropdown-item.component';
import { DropdownLabelComponent } from '../../../../../../tolle/src/lib/dropdown-label.component';
import { DropdownSeparatorComponent } from '../../../../../../tolle/src/lib/dropdown-separator.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
  selector: 'app-dropdown-with-items',
  imports: [
    DropdownMenuComponent,
    DropdownTriggerDirective,
    DropdownItemComponent,
    DropdownLabelComponent,
    DropdownSeparatorComponent,
    ButtonComponent,
  ],
  template: `
    <!-- The trigger takes a template reference to the menu. -->
    <tolle-button variant="outline" [tolleDropdownTrigger]="menu">
      My account
      <i class="ri-arrow-down-s-line ml-2"></i>
    </tolle-button>

    <tolle-dropdown-menu #menu>
      <tolle-dropdown-label>Signed in as ada&#64;example.com</tolle-dropdown-label>
      <tolle-dropdown-separator></tolle-dropdown-separator>
      <tolle-dropdown-item (click)="lastAction = 'profile'">
        <i class="ri-user-line mr-2"></i> Profile
      </tolle-dropdown-item>
      <tolle-dropdown-item (click)="lastAction = 'settings'">
        <i class="ri-settings-3-line mr-2"></i> Settings
      </tolle-dropdown-item>
      <tolle-dropdown-item [disabled]="true">
        <i class="ri-team-line mr-2"></i> Team (coming soon)
      </tolle-dropdown-item>
      <tolle-dropdown-separator></tolle-dropdown-separator>
      <tolle-dropdown-item class="text-destructive" (click)="lastAction = 'sign out'">
        <i class="ri-logout-box-r-line mr-2"></i> Sign out
      </tolle-dropdown-item>
    </tolle-dropdown-menu>

    <p class="mt-4 text-sm text-muted-foreground">Last action: {{ lastAction }}</p>
  `,
})
export class DropdownWithItemsComponent {
  lastAction = 'none';
}
