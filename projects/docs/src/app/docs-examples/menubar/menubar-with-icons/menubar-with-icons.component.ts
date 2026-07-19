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
    templateUrl: './menubar-with-icons.component.html'
})
export class MenubarWithIconsComponent { }
