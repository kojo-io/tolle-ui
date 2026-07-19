import { Component } from '@angular/core';
import {
    MenubarComponent,
    MenubarMenuComponent,
    MenubarTriggerComponent,
    MenubarContentComponent,
    MenubarItemComponent,
    MenubarLabelComponent,
    MenubarSeparatorComponent
} from '../../../../../../tolle/src/lib/menubar.component';

@Component({
    selector: 'app-basic-menubar',
    standalone: true,
    imports: [
        MenubarComponent,
        MenubarMenuComponent,
        MenubarTriggerComponent,
        MenubarContentComponent,
        MenubarItemComponent,
        MenubarLabelComponent,
        MenubarSeparatorComponent
    ],
    templateUrl: './basic-menubar.component.html'
})
export class BasicMenubarComponent {
    lastAction = 'Nothing yet';

    run(action: string): void {
        this.lastAction = action;
    }
}
