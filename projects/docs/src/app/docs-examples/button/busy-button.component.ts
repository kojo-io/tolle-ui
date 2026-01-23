import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../../tolle/src/lib/button.component';

@Component({
  selector: 'app-busy-button',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-wrap gap-4">
      <tolle-button [busy]="true">Please wait</tolle-button>
      <tolle-button variant="outline" [busy]="true">Loading...</tolle-button>
      <tolle-button size="icon" [busy]="true">
        <i class="ri-save-line"></i>
      </tolle-button>
    </div>
  `
})
export class BusyButtonComponent { }
