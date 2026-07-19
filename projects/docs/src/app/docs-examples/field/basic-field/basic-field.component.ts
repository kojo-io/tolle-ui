import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    FieldComponent,
    FieldLabelComponent,
    FieldDescriptionComponent
} from '../../../../../../tolle/src/lib/field.component';
import {
    InputGroupComponent,
    InputGroupAddonComponent,
    InputGroupInputComponent
} from '../../../../../../tolle/src/lib/input-group.component';

@Component({
    selector: 'app-basic-field',
    standalone: true,
    imports: [
        FormsModule,
        FieldComponent,
        FieldLabelComponent,
        FieldDescriptionComponent,
        InputGroupComponent,
        InputGroupAddonComponent,
        InputGroupInputComponent
    ],
    templateUrl: './basic-field.component.html'
})
export class BasicFieldComponent {
    email: string = '';
}
