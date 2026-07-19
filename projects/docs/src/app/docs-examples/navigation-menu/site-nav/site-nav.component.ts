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
    selector: 'app-site-nav',
    standalone: true,
    imports: [
        NavigationMenuComponent,
        NavigationMenuListComponent,
        NavigationMenuItemComponent,
        NavigationMenuTriggerComponent,
        NavigationMenuContentComponent,
        NavigationMenuLinkComponent
    ],
    templateUrl: './site-nav.component.html'
})
export class SiteNavComponent { }
