import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    FieldComponent,
    FieldLabelComponent,
    FieldDescriptionComponent,
    FieldGroupComponent,
    FieldSetComponent,
    FieldLegendComponent,
    FieldSeparatorComponent,
    FieldTitleComponent
} from '../../../../../../tolle/src/lib/field.component';
import {
    InputGroupComponent,
    InputGroupInputComponent,
    InputGroupTextComponent,
    InputGroupAddonComponent
} from '../../../../../../tolle/src/lib/input-group.component';

@Component({
    selector: 'app-field-set',
    standalone: true,
    imports: [
        FormsModule,
        FieldComponent,
        FieldLabelComponent,
        FieldDescriptionComponent,
        FieldGroupComponent,
        FieldSetComponent,
        FieldLegendComponent,
        FieldSeparatorComponent,
        FieldTitleComponent,
        InputGroupComponent,
        InputGroupInputComponent,
        InputGroupTextComponent,
        InputGroupAddonComponent
    ],
    templateUrl: './field-set.component.html'
})
export class FieldSetExampleComponent {
    firstName: string = 'Ada';
    lastName: string = 'Lovelace';
    workspace: string = 'analytical-engine';
}
