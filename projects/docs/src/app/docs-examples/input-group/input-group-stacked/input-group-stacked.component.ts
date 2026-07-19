import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    InputGroupComponent,
    InputGroupAddonComponent,
    InputGroupTextComponent,
    InputGroupButtonComponent,
    InputGroupTextareaComponent
} from '../../../../../../tolle/src/lib/input-group.component';

@Component({
    selector: 'app-input-group-stacked',
    standalone: true,
    imports: [
        FormsModule,
        InputGroupComponent,
        InputGroupAddonComponent,
        InputGroupTextComponent,
        InputGroupButtonComponent,
        InputGroupTextareaComponent
    ],
    templateUrl: './input-group-stacked.component.html'
})
export class InputGroupStackedComponent {
    readonly maxLength: number = 280;
    comment: string = '';
    sent: boolean = false;

    get remaining(): number {
        return this.maxLength - this.comment.length;
    }

    get tooLong(): boolean {
        return this.remaining < 0;
    }

    send(): void {
        if (!this.comment.trim() || this.tooLong) return;
        this.sent = true;
        this.comment = '';
    }
}
