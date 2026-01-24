import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardFooterComponent } from '../../../../../tolle/src/lib/card.component';
import { ButtonComponent } from '../../../../../tolle/src/lib/button.component';
import { InputComponent } from '../../../../../tolle/src/lib/input.component';

@Component({
    selector: 'app-form-card',
    standalone: true,
    imports: [CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardFooterComponent, ButtonComponent, InputComponent, FormsModule],
    template: `
    <tolle-card class="max-w-md">
      <tolle-card-header>
        <tolle-card-title class="flex items-center gap-2">
          <i class="ri-palette-line text-primary"></i>
          Theme Settings
        </tolle-card-title>
        <p class="text-sm text-muted-foreground">
          Derived colors will update as you change the primary.
        </p>
      </tolle-card-header>

      <tolle-card-content class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-xs font-bold uppercase text-muted-foreground">Primary Hex</label>
          <tolle-input [ngModel]="'#2563eb'">
            <i prefix class="ri-drop-line"></i>
          </tolle-input>
        </div>

        <div class="p-4 rounded-lg bg-secondary text-secondary-foreground text-sm">
          <strong>Pro Tip:</strong> This background is auto-generated using <code>color-mix</code>
          based on your primary color!
        </div>
      </tolle-card-content>

      <tolle-card-footer class="flex justify-between gap-1">
        <tolle-button variant="ghost">Cancel</tolle-button>
        <tolle-button>Save Changes</tolle-button>
      </tolle-card-footer>
    </tolle-card>
  `
})
export class FormCardComponent { }
