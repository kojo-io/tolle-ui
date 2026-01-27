import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-switch-interactive',
    imports: [
        CommonModule,
        FormsModule,
        SwitchComponent,
        SelectComponent,
        SelectItemComponent,
        CheckboxComponent,
        PlaygroundComponent
    ],
    templateUrl: './switch-interactive.component.html'
})
export class SwitchInteractiveComponent {
    disabled = false;
    size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
    checked = false;

    get playgroundCode(): string {
        const inputs = [
            this.disabled ? '[disabled]="true"' : '',
            this.size !== 'default' ? `size="${this.size}"` : '',
        ].filter(Boolean).join('\n  ');

        return `<tolle-switch
  [(ngModel)]="checked"${inputs ? '\n  ' + inputs : ''}
></tolle-switch>`;
    }
}
