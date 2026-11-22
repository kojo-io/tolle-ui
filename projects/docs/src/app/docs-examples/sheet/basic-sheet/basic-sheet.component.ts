import { Component } from '@angular/core';
import {
  SheetComponent,
  SheetTriggerComponent,
  SheetContentComponent,
  SheetHeaderComponent,
  SheetFooterComponent,
  SheetTitleComponent,
  SheetDescriptionComponent,
} from '../../../../../../tolle/src/lib/sheet.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';

@Component({
  selector: 'app-basic-sheet',
  imports: [
    SheetComponent,
    SheetTriggerComponent,
    SheetContentComponent,
    SheetHeaderComponent,
    SheetFooterComponent,
    SheetTitleComponent,
    SheetDescriptionComponent,
    ButtonComponent,
    InputComponent,
  ],
  template: `
    <!-- [(isOpen)] lets you close the sheet from code, e.g. after saving. -->
    <tolle-sheet [(isOpen)]="open">
      <tolle-sheet-trigger>
        <tolle-button variant="outline">Edit profile</tolle-button>
      </tolle-sheet-trigger>
      <tolle-sheet-content side="right">
        <tolle-sheet-header>
          <tolle-sheet-title>Edit profile</tolle-sheet-title>
          <tolle-sheet-description>Make changes to your profile, then save.</tolle-sheet-description>
        </tolle-sheet-header>
        <div class="grid gap-4 py-4">
          <tolle-input label="Name" placeholder="Ada Lovelace"></tolle-input>
          <tolle-input label="Username" placeholder="@ada"></tolle-input>
        </div>
        <tolle-sheet-footer>
          <tolle-button (click)="open = false">Save changes</tolle-button>
        </tolle-sheet-footer>
      </tolle-sheet-content>
    </tolle-sheet>
  `,
})
export class BasicSheetComponent {
  open = false;
}
