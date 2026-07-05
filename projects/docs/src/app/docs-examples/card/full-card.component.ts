import { Component } from '@angular/core';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardFooterComponent } from '../../../../../tolle/src/lib/card.component';
import { ButtonComponent } from '../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-full-card',
    imports: [CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardFooterComponent, ButtonComponent],
    template: `
    <tolle-card class="max-w-[400px]">
      <tolle-card-header>
        <tolle-card-title>Project Details</tolle-card-title>
        <p class="text-sm text-muted-foreground">Manage your project settings and configuration.</p>
      </tolle-card-header>
      <tolle-card-content>
        <div class="p-4 rounded-lg bg-secondary text-secondary-foreground text-sm">
          Everything you need to build amazing user interfaces.
        </div>
      </tolle-card-content>
      <tolle-card-footer class="flex justify-end gap-2">
        <tolle-button variant="ghost">Cancel</tolle-button>
        <tolle-button>Save</tolle-button>
      </tolle-card-footer>
    </tolle-card>
  `
})
export class FullCardComponent { }
