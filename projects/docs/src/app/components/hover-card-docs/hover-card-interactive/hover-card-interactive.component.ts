import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HoverCardComponent, HoverCardTriggerComponent, HoverCardContentComponent } from '../../../../../../tolle/src/lib/hover-card.component';
import { AvatarComponent } from '../../../../../../tolle/src/lib/avatar.component';
import { AvatarFallbackComponent } from '../../../../../../tolle/src/lib/avatar-fallback.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';

@Component({
    selector: 'app-hover-card-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        HoverCardComponent,
        HoverCardTriggerComponent,
        HoverCardContentComponent,
        AvatarComponent,
        AvatarFallbackComponent,
        PlaygroundComponent,
        InputComponent,
        LabelComponent
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-xl font-semibold tracking-tight mb-6">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <tolle-hover-card [openDelay]="openDelay" [closeDelay]="closeDelay">
            <tolle-hover-card-trigger>
              <button class="text-sm font-medium hover:underline focus:outline-none">&#64;angular</button>
            </tolle-hover-card-trigger>
            <tolle-hover-card-content>
              <div class="flex justify-between space-x-4">
                <tolle-avatar>
                  <tolle-avatar-fallback>NG</tolle-avatar-fallback>
                </tolle-avatar>
                <div class="space-y-1">
                  <h4 class="text-sm font-semibold">&#64;angular</h4>
                  <p class="text-sm">
                    The web framework for modern web applications.
                  </p>
                  <div class="flex items-center pt-2 text-xs text-muted-foreground">
                    Joined December 2021
                  </div>
                </div>
              </div>
            </tolle-hover-card-content>
          </tolle-hover-card>
        </div>

        <div controls class="space-y-5">
          <div class="space-y-1.5">
            <tolle-label>Open Delay (ms)</tolle-label>
            <tolle-input type="number" [(ngModel)]="openDelay" size="sm" />
          </div>
          <div class="space-y-1.5">
            <tolle-label>Close Delay (ms)</tolle-label>
            <tolle-input type="number" [(ngModel)]="closeDelay" size="sm" />
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class HoverCardInteractiveComponent {
    openDelay = 700;
    closeDelay = 300;

    get playgroundCode() {
        return `<tolle-hover-card [openDelay]="${this.openDelay}" [closeDelay]="${this.closeDelay}">
  <tolle-hover-card-trigger>
    <button>@angular</button>
  </tolle-hover-card-trigger>
  <tolle-hover-card-content>
    <div class="flex justify-between space-x-4">
      <tolle-avatar>
        <tolle-avatar-fallback>NG</tolle-avatar-fallback>
      </tolle-avatar>
      <div class="space-y-1">
        <h4 class="text-sm font-semibold">@angular</h4>
        <p class="text-sm">
          The web framework for modern web applications.
        </p>
        <div class="flex items-center pt-2">
          <span>Joined December 2021</span>
        </div>
      </div>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>`;
    }
}
