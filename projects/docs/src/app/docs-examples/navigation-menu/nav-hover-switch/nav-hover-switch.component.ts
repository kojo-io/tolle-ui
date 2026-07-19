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
    selector: 'app-nav-hover-switch',
    standalone: true,
    imports: [
        NavigationMenuComponent,
        NavigationMenuListComponent,
        NavigationMenuItemComponent,
        NavigationMenuTriggerComponent,
        NavigationMenuContentComponent,
        NavigationMenuLinkComponent
    ],
    templateUrl: './nav-hover-switch.component.html'
})
export class NavHoverSwitchComponent {
  openId: string | null = null;

  onOpenChange(id: string | null): void {
    this.openId = id;
  }
}
