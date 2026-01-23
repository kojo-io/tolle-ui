import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../../../../tolle/src/lib/badge.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';

@Component({
    selector: 'app-badge-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        BadgeComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent,
    ],
    templateUrl: './badge-interactive.component.html'
})
export class BadgeInteractiveComponent {
    variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'default';
    size: 'xs' | 'sm' | 'default' = 'default';
    removable: boolean = false;
    label: string = 'Badge';

    get playgroundCode() {
        return `<tolle-badge variant="${this.variant}" size="${this.size}"[removable]="${this.removable}">
  ${this.label}
</tolle-badge>`;
    }
}
