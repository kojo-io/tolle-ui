import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';

@Component({
    selector: 'app-label-interactive',
    imports: [
    FormsModule,
    LabelComponent,
    PlaygroundComponent,
    InputComponent
],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <div class="space-y-2">
            <tolle-label for="playground-input">{{ label }}</tolle-label>
            <tolle-input id="playground-input" placeholder="Interact with me" />
          </div>
        </div>

        <div controls class="space-y-4">
          <div class="space-y-2">
            <tolle-label>Label Text</tolle-label>
            <tolle-input 
              type="text" 
              [(ngModel)]="label" 
            />
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class LabelInteractiveComponent {
    label = 'Your Message';

    get playgroundCode() {
        return `<div class="grid w-full max-w-sm items-center gap-1.5">
  <tolle-label for="email">${this.label}</tolle-label>
  <tolle-input type="email" id="email" placeholder="Email" />
</div>`;
    }
}
