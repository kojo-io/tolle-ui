import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollAreaComponent } from '../../../../../../tolle/src/lib/scroll-area.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SeparatorComponent } from '../../../../../../tolle/src/lib/separator.component';

@Component({
    selector: 'app-scroll-area-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ScrollAreaComponent,
        PlaygroundComponent,
        SeparatorComponent
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <tolle-scroll-area class="h-72 w-48 rounded-md border border-neutral-200 dark:border-neutral-800">
            <div class="p-4">
              <h4 class="mb-4 text-sm font-medium leading-none text-foreground">Tags</h4>
              <div *ngFor="let tag of tags; let last = last">
                <div class="text-sm text-foreground">
                  {{ tag }}
                </div>
                <tolle-separator *ngIf="!last" class="my-2"></tolle-separator>
              </div>
            </div>
          </tolle-scroll-area>
        </div>
      </app-playground>
    </section>
  `
})
export class ScrollAreaInteractiveComponent {
    tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

    get playgroundCode() {
        return `<tolle-scroll-area class="h-72 w-48 rounded-md border">
  <div class="p-4">
    <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
    <div *ngFor="let tag of tags; let last = last">
      <div class="text-sm">{{ tag }}</div>
      <tolle-separator *ngIf="!last" class="my-2"></tolle-separator>
    </div>
  </div>
</tolle-scroll-area>`;
    }
}
