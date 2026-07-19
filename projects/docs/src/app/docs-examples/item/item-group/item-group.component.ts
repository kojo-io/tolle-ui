import { Component } from '@angular/core';
import {
    ItemComponent,
    ItemGroupComponent,
    ItemMediaComponent,
    ItemContentComponent,
    ItemTitleComponent,
    ItemDescriptionComponent,
    ItemActionsComponent
} from '../../../../../../tolle/src/lib/item.component';
import { BadgeComponent } from '../../../../../../tolle/src/lib/badge.component';

@Component({
    selector: 'app-item-group',
    standalone: true,
    imports: [
        ItemComponent,
        ItemGroupComponent,
        ItemMediaComponent,
        ItemContentComponent,
        ItemTitleComponent,
        ItemDescriptionComponent,
        ItemActionsComponent,
        BadgeComponent
    ],
    templateUrl: './item-group.component.html'
})
export class ItemGroupExampleComponent {
    notifications = [
        { icon: 'ri-git-pull-request-line', title: 'Pull request merged', description: 'feat: add spinner component', status: 'Merged' },
        { icon: 'ri-bug-line', title: 'New issue opened', description: 'Select does not reset on blur', status: 'Open' },
        { icon: 'ri-rocket-line', title: 'Deployment finished', description: 'Production build 1.4.2', status: 'Live' }
    ];
}
