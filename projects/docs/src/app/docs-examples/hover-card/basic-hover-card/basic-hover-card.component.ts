import { Component } from '@angular/core';
import {
  HoverCardComponent,
  HoverCardTriggerComponent,
  HoverCardContentComponent,
} from '../../../../../../tolle/src/lib/hover-card.component';

@Component({
  selector: 'app-basic-hover-card',
  imports: [HoverCardComponent, HoverCardTriggerComponent, HoverCardContentComponent],
  template: `
    <tolle-hover-card [openDelay]="300" placement="bottom">
      <tolle-hover-card-trigger>
        <a href="https://github.com/angular" class="text-sm font-medium text-primary hover:underline">&#64;angular</a>
      </tolle-hover-card-trigger>
      <tolle-hover-card-content>
        <div class="w-64 space-y-1">
          <h4 class="text-sm font-semibold">&#64;angular</h4>
          <p class="text-sm">The web framework for modern web applications.</p>
          <p class="text-xs text-muted-foreground">Joined December 2014</p>
        </div>
      </tolle-hover-card-content>
    </tolle-hover-card>
  `,
})
export class BasicHoverCardComponent {}
