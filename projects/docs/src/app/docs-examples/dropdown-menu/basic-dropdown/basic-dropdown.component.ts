import { Component } from '@angular/core';

import { DropdownMenuComponent } from '../../../../../../tolle/src/lib/dropdown-menu.component';
import { DropdownTriggerDirective } from '../../../../../../tolle/src/lib/dropdown-trigger.directive';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
  selector: 'app-basic-dropdown',
  imports: [DropdownMenuComponent, DropdownTriggerDirective, ButtonComponent],
  template: `
    <tolle-button variant="outline" [tolleDropdownTrigger]="menu">
      Open Menu
      <i class="ri-arrow-down-s-line ml-2"></i>
    </tolle-button>

    <tolle-dropdown-menu #menu>
      <div class="flex flex-col">
        <button
          class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
          <i class="ri-edit-line"></i>
          Edit
        </button>
        <button
          class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
          <i class="ri-share-line"></i>
          Share
        </button>
        <div class="my-1 h-px bg-border"></div>
        <button
          class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10">
          <i class="ri-delete-bin-line"></i>
          Delete
        </button>
      </div>
    </tolle-dropdown-menu>
  `,
})
export class BasicDropdownComponent {}
