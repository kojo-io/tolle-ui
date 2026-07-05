import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmptyStateComponent } from '../../../../../../tolle/src/lib/empty-state.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { TextareaComponent } from '../../../../../../tolle/src/lib/textarea.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';

@Component({
  selector: 'app-empty-state-interactive',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmptyStateComponent,
    ButtonComponent,
    PlaygroundComponent,
    SelectComponent,
    SelectItemComponent,
    InputComponent,
    TextareaComponent,
    LabelComponent
  ],
  template: `
    <section class="space-y-6">
      <h2 class="text-xl font-semibold tracking-tight text-foreground">Interactive Playground</h2>
      
      <app-playground [code]="codeSnippet">
        <div preview class="flex items-center justify-center min-h-[400px] w-full">
          <tolle-empty-state 
            [variant]="variant" 
            [title]="title" 
            [description]="description"
            class="w-full">
            <i icon [class]="iconClass"></i>
            <div actions *ngIf="variant !== 'minimal'" class="gap-2 flex">
              <tolle-button variant="outline" size="sm">Explore</tolle-button>
              <tolle-button size="sm">Get Started</tolle-button>
            </div>
          </tolle-empty-state>
        </div>

        <div controls class="space-y-5">
          <div class="space-y-1.5">
            <tolle-label>Title</tolle-label>
            <tolle-input [(ngModel)]="title" size="sm" placeholder="No results found" />
          </div>

          <div class="space-y-1.5">
            <tolle-label>Description</tolle-label>
            <tolle-textarea [(ngModel)]="description" [rows]="3" placeholder="Description text" />
          </div>

          <div class="space-y-1.5">
            <tolle-label>Variant</tolle-label>
            <tolle-select [(ngModel)]="variant" size="sm">
              <tolle-select-item value="default">Default (Bordered)</tolle-select-item>
              <tolle-select-item value="minimal">Minimal</tolle-select-item>
            </tolle-select>
          </div>

          <div class="space-y-1.5">
            <tolle-label>Icon Context</tolle-label>
            <tolle-select [(ngModel)]="iconType" size="sm">
              <tolle-select-item value="inbox">Inbox</tolle-select-item>
              <tolle-select-item value="search">Search</tolle-select-item>
              <tolle-select-item value="error">Error</tolle-select-item>
            </tolle-select>
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class EmptyStateInteractiveComponent {
  title = 'No results found';
  description = 'Your search did not match any files. Please try again with different keywords.';
  variant: 'default' | 'minimal' = 'default';
  iconType: 'inbox' | 'search' | 'error' = 'search';

  get iconClass(): string {
    const size = this.variant === 'minimal' ? 'text-xl' : 'text-3xl';
    const base = 'text-muted-foreground/60';
    switch (this.iconType) {
      case 'inbox': return `ri-inbox-line ${size} ${base}`;
      case 'search': return `ri-search-2-line ${size} ${base}`;
      case 'error': return `ri-error-warning-line ${size} ${base}`;
      default: return `ri-inbox-line ${size} ${base}`;
    }
  }

  get codeSnippet(): string {
    const descAttr = this.description ? ` description="${this.description}"` : '';
    const iconTag = this.iconType === 'search' ? 'ri-search-2-line' : this.iconType === 'error' ? 'ri-error-warning-line' : 'ri-inbox-line';

    return `<tolle-empty-state 
  variant="${this.variant}" 
  title="${this.title}"${descAttr}
>
  <i icon class="${iconTag} ..."></i>
  <div actions>
    <tolle-button>Action</tolle-button>
  </div>
</tolle-empty-state>`;
  }
}
