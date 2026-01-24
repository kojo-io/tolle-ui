import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';

@Component({
    selector: 'app-check-box-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CheckboxComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent,
        InputComponent
    ],
    templateUrl: './check-box-interactive.component.html'
})
export class CheckBoxInteractiveComponent {
    playgroundLabel = 'Accept terms and conditions';
    playgroundDescription = 'You agree to our Terms of Service and Privacy Policy.';
    playgroundSize: 'xs' | 'sm' | 'default' | 'lg' = 'default';
    playgroundDisabled = false;
    playgroundChecked = false;

    get playgroundCode() {
        return `<div class="flex items-start space-x-2">
  <tolle-checkbox
    [(ngModel)]="checked"
    size="${this.playgroundSize}"
    ${this.playgroundDisabled ? '[disabled]="true"' : ''}
  />
  <div class="grid gap-1.5 leading-none">
    <label class="text-sm font-medium leading-none">
      ${this.playgroundLabel}
    </label>
    ${this.playgroundDescription ? `<p class="text-xs text-muted-foreground">${this.playgroundDescription}</p>` : ''}
  </div>
</div>`;
    }
}
