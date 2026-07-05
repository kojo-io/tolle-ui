import { Component } from '@angular/core';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../../../tolle/src/lib/card.component';

@Component({
    selector: 'app-basic-card',
    imports: [CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent],
    template: `
    <tolle-card class="max-w-[350px]">
      <tolle-card-header>
        <tolle-card-title>Card Title</tolle-card-title>
      </tolle-card-header>
      <tolle-card-content>
        <p class="text-sm text-muted-foreground">This is a basic card with a title and content area.</p>
      </tolle-card-content>
    </tolle-card>
  `
})
export class BasicCardComponent { }
