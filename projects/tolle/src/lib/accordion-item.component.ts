import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-accordion-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cn('flex flex-col border-b border-border', class)">
      <button
        type="button"
        (click)="toggle()"
        class="flex flex-1 items-center justify-between py-4 font-medium transition-all [&[data-state=open]>i]:rotate-180"
        [attr.data-state]="isOpen ? 'open' : 'closed'"
      >
        <span class="text-left">{{ title }}</span>
        <i class="ri-arrow-down-s-line text-muted-foreground transition-transform"></i>
      </button>

      <div
        *ngIf="isOpen"
        class="pb-4 text-sm text-muted-foreground overflow-hidden"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class AccordionItemComponent {
  @Input() title: string = '';
  @Input() class: string = '';
  @Input() id!: string | number;

  isOpen = false;

  // This will be set by the parent Accordion component
  onToggle?: (id: string | number) => void;

  toggle() {
    if (this.onToggle) {
      this.onToggle(this.id);
    } else {
      this.isOpen = !this.isOpen;
    }
  }

  protected readonly cn = cn;
}
