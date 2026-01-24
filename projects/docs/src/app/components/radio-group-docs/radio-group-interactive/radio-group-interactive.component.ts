import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioGroupComponent } from '../../../../../../tolle/src/lib/radio-group.component';
import { RadioItemComponent } from '../../../../../../tolle/src/lib/radio-item.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-radio-group-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RadioGroupComponent,
        RadioItemComponent,
        InputComponent,
        CheckboxComponent,
        PlaygroundComponent
    ],
    templateUrl: './radio-group-interactive.component.html'
})
export class RadioGroupInteractiveComponent {
    disabled = false;
    name = 'plan';
    selectedValue = 'default';

    get playgroundCode(): string {
        const inputs = [
            this.disabled ? '[disabled]="true"' : '',
            this.name ? `name="${this.name}"` : '',
        ].filter(Boolean).join('\n  ');

        return `<tolle-radio-group
  [(ngModel)]="selectedValue"${inputs ? '\n  ' + inputs : ''}
>
  <tolle-radio-item value="default">Default</tolle-radio-item>
  <tolle-radio-item value="comfortable">Comfortable</tolle-radio-item>
  <tolle-radio-item value="compact">Compact</tolle-radio-item>
</tolle-radio-group>

<!-- Selected: {{ selectedValue }} -->`;
    }
}
