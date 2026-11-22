import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';

@Component({
  selector: 'app-basic-label',
  imports: [FormsModule, LabelComponent, CheckboxComponent, SwitchComponent],
  template: `
    <div class="grid w-full max-w-sm gap-6">
      <!-- Usually you don't need tolle-label: controls take a label input. -->
      <tolle-checkbox label="Accept terms and conditions" [(ngModel)]="accepted"></tolle-checkbox>

      <!-- For a custom layout, pair for="…" with the control's id; Tolle puts the id on the focusable element. -->
      <div class="flex items-center justify-between rounded-md border p-3">
        <div class="grid gap-1">
          <tolle-label for="marketing">Marketing emails</tolle-label>
          <span class="text-xs text-muted-foreground">Product news, at most once a month.</span>
        </div>
        <tolle-switch id="marketing" [(ngModel)]="marketing"></tolle-switch>
      </div>
    </div>
  `,
})
export class BasicLabelComponent {
  accepted = false;
  marketing = true;
}
