import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollapsibleComponent, CollapsibleTriggerComponent, CollapsibleContentComponent } from '../../../../../../tolle/src/lib/collapsible.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-collapsible-interactive',
    imports: [
        CommonModule,
        FormsModule,
        CollapsibleComponent,
        CollapsibleTriggerComponent,
        CollapsibleContentComponent,
        PlaygroundComponent,
        ButtonComponent
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <tolle-collapsible [(open)]="isOpen" class="w-[350px] space-y-2 flex flex-col">
            <div class="flex items-center justify-between space-x-4 px-4">
              <h4 class="text-sm font-semibold">&#64;peduarte starred 3 repositories</h4>
              <tolle-collapsible-trigger>
                <tolle-button variant="ghost" size="sm" class="w-9 p-0">
                  <i [class]="isOpen ? 'ri-close-line' : 'ri-expand-up-down-line'" class="h-4 w-4"></i>
                  <span class="sr-only">Toggle</span>
                </tolle-button>
              </tolle-collapsible-trigger>
            </div>
            <div class="rounded-md border border-neutral-200 px-4 py-3 font-mono text-sm dark:border-neutral-800">
              &#64;tolle-ui/primitives
            </div>
            <tolle-collapsible-content class="space-y-2 flex flex-col">
              <div class="rounded-md border border-neutral-200 px-4 py-3 font-mono text-sm dark:border-neutral-800">
                &#64;tolle-ui/colors
              </div>
              <div class="rounded-md border border-neutral-200 px-4 py-3 font-mono text-sm dark:border-neutral-800">
                &#64;tolle/angular
              </div>
            </tolle-collapsible-content>
          </tolle-collapsible>
        </div>
      </app-playground>
    </section>
  `
})
export class CollapsibleInteractiveComponent {
    isOpen = false;

    get playgroundCode() {
        return `<tolle-collapsible [(open)]="isOpen" class="w-[350px] space-y-2 flex flex-col">
  <div class="flex items-center justify-between space-x-4 px-4">
    <h4 class="text-sm font-semibold">@peduarte starred 3 repositories</h4>
    <tolle-collapsible-trigger>
      <tolle-button variant="ghost" size="sm" class="w-9 p-0">
        <i class="ri-expand-up-down-line h-4 w-4"></i>
      </tolle-button>
    </tolle-collapsible-trigger>
  </div>
  <div class="rounded-md border px-4 py-3 font-mono text-sm">
    @tolle-ui/primitives
  </div>
  <tolle-collapsible-content class="space-y-2 flex flex-col">
    <div class="rounded-md border px-4 py-3 font-mono text-sm">
      @tolle-ui/colors
    </div>
    <div class="rounded-md border px-4 py-3 font-mono text-sm">
      @stitches/react
    </div>
  </tolle-collapsible-content>
</tolle-collapsible>`;
    }
}
