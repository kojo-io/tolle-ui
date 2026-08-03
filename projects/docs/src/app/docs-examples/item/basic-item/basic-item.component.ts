import { Component } from '@angular/core';
import {
    ItemComponent,
    ItemMediaComponent,
    ItemContentComponent,
    ItemTitleComponent,
    ItemDescriptionComponent,
    ItemActionsComponent
} from '../../../../../../tolle/src/lib/item.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-basic-item',
    imports: [
        ItemComponent,
        ItemMediaComponent,
        ItemContentComponent,
        ItemTitleComponent,
        ItemDescriptionComponent,
        ItemActionsComponent,
        ButtonComponent
    ],
    templateUrl: './basic-item.component.html'
})
export class BasicItemComponent { }
