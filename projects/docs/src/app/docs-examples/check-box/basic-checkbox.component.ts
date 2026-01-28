import { Component } from '@angular/core';
import { CheckboxComponent } from '../../../../../tolle/src/lib/checkbox.component';

@Component({
    selector: 'app-basic-checkbox',
    imports: [CheckboxComponent],
    template: `
    <div class="flex items-center space-x-2">
      <tolle-checkbox id="terms" />
      <label
        for="terms"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  `
})
export class BasicCheckboxComponent { }
