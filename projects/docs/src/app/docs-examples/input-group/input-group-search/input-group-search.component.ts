import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    InputGroupComponent,
    InputGroupAddonComponent,
    InputGroupInputComponent
} from '../../../../../../tolle/src/lib/input-group.component';

@Component({
    selector: 'app-input-group-search',
    standalone: true,
    imports: [
        FormsModule,
        InputGroupComponent,
        InputGroupAddonComponent,
        InputGroupInputComponent
    ],
    templateUrl: './input-group-search.component.html'
})
export class InputGroupSearchComponent {
    query: string = '';
}
