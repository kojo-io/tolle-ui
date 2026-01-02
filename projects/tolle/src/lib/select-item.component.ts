import {Component, Input, HostListener, ElementRef, Optional} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';
import {SelectService} from './select.service';

@Component({
  selector: 'tolle-select-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="!hidden"
      [class]="cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
        getItemClasses(),
        class
      )"
      [attr.aria-disabled]="disabled"
      [attr.aria-selected]="selected"
      role="option"
    >
      <!-- Single Select: Checkmark -->
      <span *ngIf="!multiSelect && selected" class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <i class="ri-check-line text-primary"></i>
      </span>

      <!-- Multi-Select: Checkbox -->
      <span *ngIf="multiSelect" class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <div [class]="cn(
          'flex h-4 w-4 items-center justify-center rounded-sm border transition-all duration-200',
          selected ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
        )">
          <i [class]="cn(
            'ri-check-line text-xs transition-all duration-200',
            selected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          )"></i>
        </div>
      </span>

      <!-- Content -->
      <span class="flex-1 truncate">
        <ng-content></ng-content>
      </span>

      <!-- Disabled indicator -->
      <span *ngIf="disabled && !selected" class="ml-2 text-xs text-muted-foreground/50">
        <i class="ri-forbid-line"></i>
      </span>
    </div>
  `,
})
export class SelectItemComponent {
  @Input() value: any;
  @Input() class = '';
  @Input() selected = false;
  @Input() disabled = false;
  @Input() multiSelect = false; // Will be set by parent component

  hidden = false;

  constructor(
    @Optional() private selectService: SelectService,
    private el: ElementRef
  ) {}

  // Helper method for the parent to get the searchable text
  getLabel(): string {
    return this.el.nativeElement.textContent?.trim() || '';
  }

  getItemClasses(): string {
    return cn(
      // Base state
      'focus:bg-accent focus:text-accent-foreground',

      // Hover states (only if not disabled)
      !this.disabled && [
        'cursor-pointer',
        'hover:bg-accent hover:text-accent-foreground'
      ],

      // Selected state
      this.selected && [
        this.multiSelect
          ? 'bg-primary/5 text-foreground'
          : 'bg-accent text-accent-foreground'
      ],

      // Disabled state
      this.disabled && [
        'opacity-50',
        'cursor-not-allowed',
        'hover:bg-transparent hover:text-foreground'
      ]
    );
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.hidden || this.disabled) return;

    event.stopPropagation();
    if (this.selectService) {
      const label = this.getLabel();

      if (this.multiSelect) {
        // For multi-select, toggle selection
        this.selected = !this.selected;
      }
      // For both single and multi-select, notify parent
      this.selectService.registerClick(this.value, label);
    }
  }

  protected cn = cn;
}
