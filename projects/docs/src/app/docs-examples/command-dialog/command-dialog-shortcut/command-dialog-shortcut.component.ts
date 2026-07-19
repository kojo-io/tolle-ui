import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandDialogComponent } from '../../../../../../tolle/src/lib/command-dialog.component';
import {
    CommandComponent,
    CommandInputComponent,
    CommandListComponent,
    CommandEmptyComponent,
    CommandGroupComponent,
    CommandItemComponent,
    CommandShortcutComponent
} from '../../../../../../tolle/src/lib/command.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { KbdComponent, KbdGroupComponent } from '../../../../../../tolle/src/lib/kbd.component';

@Component({
    selector: 'app-command-dialog-shortcut',
    standalone: true,
    imports: [
        CommonModule,
        CommandDialogComponent,
        CommandComponent,
        CommandInputComponent,
        CommandListComponent,
        CommandEmptyComponent,
        CommandGroupComponent,
        CommandItemComponent,
        CommandShortcutComponent,
        ButtonComponent,
        KbdComponent,
        KbdGroupComponent
    ],
    templateUrl: './command-dialog-shortcut.component.html'
})
export class CommandDialogShortcutComponent {
    paletteOpen = false;
    status = 'idle';
    lastAction = '';

    onSelected(value: string): void {
        this.lastAction = value;
        this.paletteOpen = false;
    }
}
