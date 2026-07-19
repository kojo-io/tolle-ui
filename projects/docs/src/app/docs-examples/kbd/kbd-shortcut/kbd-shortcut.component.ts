import { Component } from '@angular/core';
import { KbdComponent, KbdGroupComponent } from '../../../../../../tolle/src/lib/kbd.component';

@Component({
    selector: 'app-kbd-shortcut',
    standalone: true,
    imports: [KbdComponent, KbdGroupComponent],
    templateUrl: './kbd-shortcut.component.html'
})
export class KbdShortcutComponent { }
