import { Component } from '@angular/core';
import {
  NavigationMenuComponent,
  NavigationMenuListComponent,
  NavigationMenuItemComponent,
  NavigationMenuTriggerComponent,
  NavigationMenuContentComponent,
  NavigationMenuLinkComponent
} from '../../../../../../tolle/src/lib/navigation-menu.component';

@Component({
    selector: 'app-nav-flat-and-dropdown',
    standalone: true,
    imports: [
        NavigationMenuComponent,
        NavigationMenuListComponent,
        NavigationMenuItemComponent,
        NavigationMenuTriggerComponent,
        NavigationMenuContentComponent,
        NavigationMenuLinkComponent
    ],
    templateUrl: './nav-flat-and-dropdown.component.html'
})
export class NavFlatAndDropdownComponent { }
