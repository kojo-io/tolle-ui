import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';

@Component({
    selector: 'app-basic-switch-example',
    standalone: true,
    imports: [CommonModule, FormsModule, SwitchComponent],
    template: `
    <div class="flex items-center space-x-2">
      <tolle-switch id="airplane-mode" [(ngModel)]="airplaneMode"></tolle-switch>
      <label for="airplane-mode" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Airplane Mode
      </label>
    </div>
  `
})
export class BasicSwitchExampleComponent {
    airplaneMode = false;
}
