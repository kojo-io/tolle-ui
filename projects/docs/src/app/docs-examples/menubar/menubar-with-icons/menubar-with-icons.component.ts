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
    selector: 'app-menubar-with-icons',
    imports: [
        MenubarComponent,
        MenubarMenuComponent,
        MenubarTriggerComponent,
        MenubarContentComponent,
        MenubarItemComponent,
        MenubarLabelComponent,
        MenubarSeparatorComponent
    ],
    templateUrl: './menubar-with-icons.component.html'
})
export class MenubarWithIconsComponent { }
