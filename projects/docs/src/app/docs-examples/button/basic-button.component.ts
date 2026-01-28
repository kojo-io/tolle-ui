import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-basic-button',
    imports: [ButtonComponent],
    template: `
    <div class="flex flex-wrap gap-4">
      <tolle-button>Primary (Auto)</tolle-button>
      <tolle-button variant="secondary">Secondary (Derived)</tolle-button>
      <tolle-button variant="outline">Outline</tolle-button>
      <tolle-button variant="ghost">Ghost</tolle-button>
      <tolle-button variant="link">Link</tolle-button>
    </div>
    
    <div class="flex flex-wrap items-center gap-4 mt-8">
      <tolle-button size="sm">Small</tolle-button>
      <tolle-button size="default">Default</tolle-button>
      <tolle-button size="lg">Large</tolle-button>
    </div>
  `
})
export class BasicButtonComponent { }
