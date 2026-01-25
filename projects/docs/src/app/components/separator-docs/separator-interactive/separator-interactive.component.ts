import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeparatorComponent } from '../../../../../../tolle/src/lib/separator.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';

@Component({
    selector: 'app-separator-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SeparatorComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <div class="space-y-4 w-full">
            <div>
              <h4 class="text-sm font-medium leading-none">Tolle UI</h4>
              <p class="text-sm text-muted-foreground">
                An open-source UI component library.
              </p>
            </div>
            <tolle-separator [orientation]="orientation"></tolle-separator>
            <div class="flex h-5 items-center space-x-4 text-sm" [class.flex-col]="orientation === 'vertical'" [class.h-auto]="orientation === 'vertical'">
              <div>Blog</div>
              <tolle-separator orientation="vertical" *ngIf="orientation === 'horizontal'"></tolle-separator>
              <tolle-separator orientation="horizontal" *ngIf="orientation === 'vertical'" class="my-2"></tolle-separator>
              <div>Docs</div>
              <tolle-separator orientation="vertical" *ngIf="orientation === 'horizontal'"></tolle-separator>
              <tolle-separator orientation="horizontal" *ngIf="orientation === 'vertical'" class="my-2"></tolle-separator>
              <div>Source</div>
            </div>
          </div>
        </div>

        <div controls class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Orientation</label>
            <tolle-select [(ngModel)]="orientation">
              <tolle-select-item value="horizontal">Horizontal</tolle-select-item>
              <tolle-select-item value="vertical">Vertical</tolle-select-item>
            </tolle-select>
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class SeparatorInteractiveComponent {
    orientation: 'horizontal' | 'vertical' = 'horizontal';

    get playgroundCode() {
        return `<tolle-separator orientation="${this.orientation}"></tolle-separator>`;
    }
}
