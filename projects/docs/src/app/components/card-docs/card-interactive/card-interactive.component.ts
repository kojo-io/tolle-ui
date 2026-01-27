import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardFooterComponent } from '../../../../../../tolle/src/lib/card.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';

@Component({
    selector: 'app-card-interactive',
    imports: [
        CommonModule,
        FormsModule,
        CardComponent,
        CardHeaderComponent,
        CardTitleComponent,
        CardContentComponent,
        CardFooterComponent,
        PlaygroundComponent,
        InputComponent,
        CheckboxComponent
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <tolle-card [class]="customClass">
            <tolle-card-header *ngIf="showHeader">
              <tolle-card-title>{{ title }}</tolle-card-title>
              <p *ngIf="description" class="text-sm text-muted-foreground">{{ description }}</p>
            </tolle-card-header>
            <tolle-card-content>
              <p class="text-sm">This is the main content area of the card. You can add any components or text here.</p>
            </tolle-card-content>
            <tolle-card-footer *ngIf="showFooter">
              <span class="text-xs text-muted-foreground">Card Footer Content</span>
            </tolle-card-footer>
          </tolle-card>
        </div>

        <div controls class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Title</label>
            <tolle-input [(ngModel)]="title" placeholder="Card Title" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Description</label>
            <tolle-input [(ngModel)]="description" placeholder="Card Description" />
          </div>
          <div class="flex items-center gap-4 py-2">
            <div class="flex items-center gap-2">
              <tolle-checkbox [(ngModel)]="showHeader" size="sm"></tolle-checkbox>
              <label class="text-sm font-medium cursor-pointer" (click)="showHeader = !showHeader">Header</label>
            </div>
            <div class="flex items-center gap-2">
              <tolle-checkbox [(ngModel)]="showFooter" size="sm"></tolle-checkbox>
              <label class="text-sm font-medium cursor-pointer" (click)="showFooter = !showFooter">Footer</label>
            </div>
          </div>
           <div class="space-y-2">
            <label class="text-sm font-medium">Custom Class (width)</label>
            <tolle-input [(ngModel)]="customClass" placeholder="e.g., max-w-sm" />
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class CardInteractiveComponent {
  title = 'Card Title';
  description = 'Card Description';
  showHeader = true;
  showFooter = true;
  customClass = 'max-w-[400px] w-full';

  get playgroundCode() {
    let header = '';
    if (this.showHeader) {
      header = `
  <tolle-card-header>
    <tolle-card-title>${this.title}</tolle-card-title>${this.description ? `\n    <p class="text-sm text-muted-foreground">${this.description}</p>` : ''}
  </tolle-card-header>`;
    }

    let footer = '';
    if (this.showFooter) {
      footer = `
  <tolle-card-footer>
    <span class="text-xs text-muted-foreground">Card Footer Content</span>
  </tolle-card-footer>`;
    }

    return `<tolle-card class="${this.customClass}">${header}
  <tolle-card-content>
    <p class="text-sm">Card content goes here...</p>
  </tolle-card-content>${footer}
</tolle-card>`;
  }
}
