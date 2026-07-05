import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardFooterComponent } from '../../../../../../tolle/src/lib/card.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';

@Component({
  selector: 'app-card-interactive',
  standalone: true,
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
    SwitchComponent,
    LabelComponent
  ],
  template: `
    <section class="mb-16" id="playground">
      <h2 class="text-xl font-semibold tracking-tight mb-6">Interactive Playground</h2>
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

        <div controls class="space-y-5">
          <div class="space-y-1.5">
            <tolle-label>Title</tolle-label>
            <tolle-input [(ngModel)]="title" size="sm" placeholder="Card Title" />
          </div>
          <div class="space-y-1.5">
            <tolle-label>Description</tolle-label>
            <tolle-input [(ngModel)]="description" size="sm" placeholder="Card Description" />
          </div>

          <label class="flex items-center justify-between text-sm font-medium">
            <span>Header</span>
            <tolle-switch [(ngModel)]="showHeader" size="sm" />
          </label>

          <label class="flex items-center justify-between text-sm font-medium">
            <span>Footer</span>
            <tolle-switch [(ngModel)]="showFooter" size="sm" />
          </label>

          <div class="space-y-1.5">
            <tolle-label>Custom Class (width)</tolle-label>
            <tolle-input [(ngModel)]="customClass" size="sm" placeholder="e.g., max-w-sm" />
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
