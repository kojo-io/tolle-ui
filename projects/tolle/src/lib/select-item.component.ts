import { Component, input, HostListener, ElementRef, Optional, model, signal } from '@angular/core';

import { cn } from './utils/cn';
import { SelectService } from './select.service';

@Component({
  selector: 'tolle-select-item',
  standalone: true,
  imports: [],
  template: `
    @if (!hidden()) {
      <div
      [class]="cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
        getItemClasses(),
        class()
      )"
        [attr.aria-disabled]="disabled()"
        [attr.aria-selected]="selected()"
        role="option"
        >
        <!-- Single Select: Checkmark -->
        @if (!multiSelect() && selected()) {
          <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <i class="ri-check-line text-primary"></i>
          </span>
        }
        <!-- Multi-Select: Checkbox -->
        @if (multiSelect()) {
          <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <div [class]="cn(
              'flex h-4 w-4 items-center justify-center rounded-sm border transition-all duration-200',
              selected() ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
            )">
              <i [class]="cn(
                'ri-check-line text-xs transition-all duration-200',
                selected() ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              )"></i>
            </div>
          </span>
        }
        <!-- Content -->
        <span class="flex-1 truncate">
          <ng-content></ng-content>
        </span>
        <!-- Disabled indicator -->
        @if (disabled() && !selected()) {
          <span class="ml-2 text-xs text-muted-foreground/50">
            <i class="ri-forbid-line"></i>
          </span>
        }
      </div>
    }
    `
})
export class SelectItemComponent {
  value = input<any>();
  class = input<string>('');
  disabled = model<boolean>(false);
  multiSelect = input<boolean>(false);

  selected = signal(false);
  hidden = signal(false);

  constructor(
    @Optional() private selectService: SelectService,
    private el: ElementRef
  ) { }

  // Helper method for the parent to get the searchable text
  getLabel(): string {
    return this.el.nativeElement.textContent?.trim() || '';
  }

  getItemClasses(): string {
    return cn(
      // Base state
      'focus:bg-accent focus:text-accent-foreground',

      // Hover states (only if not disabled)
      !this.disabled() && [
        'cursor-pointer',
        'hover:bg-accent hover:text-accent-foreground'
      ],

      // Selected state
      this.selected() && [
        this.multiSelect()
          ? 'bg-primary/5 text-foreground'
          : 'bg-accent text-accent-foreground'
      ],

      // Disabled state
      this.disabled() && [
        'opacity-50',
        'cursor-not-allowed',
        'hover:bg-transparent hover:text-foreground'
      ]
    );
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.hidden() || this.disabled()) return;

    event.stopPropagation();
    if (this.selectService) {
      const label = this.getLabel();

      if (this.multiSelect()) {
        // For multi-select, toggle selection
        this.selected.set(!this.selected());
      }
      // For both single and multi-select, notify parent
      this.selectService.registerClick(this.value(), label);
    }
  }

  protected cn = cn;
}
