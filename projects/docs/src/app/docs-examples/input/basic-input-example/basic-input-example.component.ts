import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';

@Component({
    selector: 'app-basic-input-example',
    imports: [FormsModule, InputComponent],
    template: `
    <div class="w-full max-w-sm space-y-4">
      <tolle-input
        label="Email"
        type="email"
        placeholder="name@example.com"
        hint="We'll never share your email.">
        <i prefix class="ri-mail-line"></i>
      </tolle-input>
    </div>
  `
})
export class BasicInputExampleComponent { }
