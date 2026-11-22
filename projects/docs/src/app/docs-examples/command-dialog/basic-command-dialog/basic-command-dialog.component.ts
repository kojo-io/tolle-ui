import { Component } from '@angular/core';

import { CommandDialogComponent } from '../../../../../../tolle/src/lib/command-dialog.component';
import {
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandItemComponent,
  CommandSeparatorComponent,
  CommandShortcutComponent,
} from '../../../../../../tolle/src/lib/command.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { KbdComponent, KbdGroupComponent } from '../../../../../../tolle/src/lib/kbd.component';

@Component({
  selector: 'app-basic-command-dialog',
  imports: [
    CommandDialogComponent,
    CommandComponent,
    CommandInputComponent,
    CommandListComponent,
    CommandEmptyComponent,
    CommandGroupComponent,
    CommandItemComponent,
    CommandSeparatorComponent,
    CommandShortcutComponent,
    ButtonComponent,
    KbdComponent,
    KbdGroupComponent,
  ],
  templateUrl: './basic-command-dialog.component.html',
})
export class BasicCommandDialogComponent {
  paletteOpen = false;
  lastCommand = '';

  onSelected(value: string): void {
    this.lastCommand = value;
    this.paletteOpen = false;
  }
}
