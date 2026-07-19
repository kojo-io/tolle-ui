import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    InputGroupComponent,
    InputGroupAddonComponent,
    InputGroupInputComponent,
    InputGroupTextComponent,
    InputGroupButtonComponent
} from '../../../../../../tolle/src/lib/input-group.component';

@Component({
    selector: 'app-input-group-addons',
    standalone: true,
    imports: [
        FormsModule,
        InputGroupComponent,
        InputGroupAddonComponent,
        InputGroupInputComponent,
        InputGroupTextComponent,
        InputGroupButtonComponent
    ],
    templateUrl: './input-group-addons.component.html'
})
export class InputGroupAddonsComponent {
    amount: string = '49.00';
    inviteLink: string = 'https://tolle.dev/invite/9f2a';
    copied: boolean = false;

    clear(): void {
        this.amount = '';
        this.copied = false;
    }

    copy(): void {
        this.copied = true;
    }
}
