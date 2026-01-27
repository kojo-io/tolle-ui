import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmptyStateComponent } from '../../../../../../tolle/src/lib/empty-state.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';

@Component({
    selector: 'app-empty-state-interactive',
    imports: [
        CommonModule,
        FormsModule,
        EmptyStateComponent,
        ButtonComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent
    ],
    template: `
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-foreground">Interactive Playground</h2>
      
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

        <div controls class="grid gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none text-foreground">Title</label>
            <input 
              type="text" 
              [(ngModel)]="title" 
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none text-foreground">Description</label>
            <textarea 
              [(ngModel)]="description" 
              rows="3"
              class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            ></textarea>
          </div>

          <div class="space-y-2">
            <h3 class="text-sm font-medium leading-none text-foreground">Variant</h3>
            <tolle-select [(ngModel)]="variant" size="sm">
              <tolle-select-item value="default">Default (Bordered)</tolle-select-item>
              <tolle-select-item value="minimal">Minimal</tolle-select-item>
            </tolle-select>
          </div>

          <div class="space-y-2">
            <h3 class="text-sm font-medium leading-none text-foreground">Icon Context</h3>
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
