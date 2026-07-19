import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandItemComponent,
  CommandSeparatorComponent,
  CommandShortcutComponent
} from '../../../../../../tolle/src/lib/command.component';

@Component({
    selector: 'app-basic-command',
    standalone: true,
    imports: [
        CommonModule,
        CommandComponent,
        CommandInputComponent,
        CommandListComponent,
        CommandEmptyComponent,
        CommandGroupComponent,
        CommandItemComponent,
        CommandSeparatorComponent,
        CommandShortcutComponent
    ],
    templateUrl: './basic-command.component.html'
})
export class BasicCommandComponent {
  chosen: string | null = null;

  onSelected(value: string): void {
    this.chosen = value;
  }
}
