import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-destructive-button',
    imports: [ButtonComponent],
    template: `
    <div class="flex flex-wrap gap-4">
      <tolle-button variant="destructive">Destructive Default</tolle-button>
      <tolle-button variant="destructive" size="sm">Small</tolle-button>
      <tolle-button variant="destructive" size="lg">Large</tolle-button>
    </div>
  `
})
export class DestructiveButtonComponent { }
