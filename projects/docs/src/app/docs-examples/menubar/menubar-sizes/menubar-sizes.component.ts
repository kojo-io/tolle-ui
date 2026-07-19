import { Component } from '@angular/core';
import {
    MenubarComponent,
    MenubarMenuComponent,
    MenubarTriggerComponent,
    MenubarContentComponent,
    MenubarItemComponent
} from '../../../../../../tolle/src/lib/menubar.component';

@Component({
    selector: 'app-menubar-sizes',
    standalone: true,
    imports: [
        MenubarComponent,
        MenubarMenuComponent,
        MenubarTriggerComponent,
        MenubarContentComponent,
        MenubarItemComponent
    ],
    templateUrl: './menubar-sizes.component.html'
})
export class MenubarSizesComponent { }
