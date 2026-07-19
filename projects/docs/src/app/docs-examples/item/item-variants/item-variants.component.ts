import { Component } from '@angular/core';
import {
    ItemComponent,
    ItemContentComponent,
    ItemTitleComponent,
    ItemDescriptionComponent
} from '../../../../../../tolle/src/lib/item.component';

@Component({
    selector: 'app-item-variants',
    standalone: true,
    imports: [ItemComponent, ItemContentComponent, ItemTitleComponent, ItemDescriptionComponent],
    templateUrl: './item-variants.component.html'
})
export class ItemVariantsComponent { }
