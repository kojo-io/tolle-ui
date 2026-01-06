import { Component, Input, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionItemComponent } from './accordion-item.component';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-accordion',
  standalone: true,
  imports: [CommonModule], // No AccordionItemComponent import needed here if projected via ng-content
  template: `
    <div [class]="cn('w-full', class)">
      <ng-content></ng-content>
    </div>
  `
})
export class AccordionComponent implements AfterContentInit {
  @Input() type: 'single' | 'multiple' = 'single';
  @Input() class: string = '';

  @ContentChildren(AccordionItemComponent) items!: QueryList<AccordionItemComponent>;

  ngAfterContentInit() {
    // 1. Assign IDs and Listeners on load
    this.initItems();

    // 2. Re-init if items change dynamically (optional but good for robustness)
    this.items.changes.subscribe(() => this.initItems());
  }

  private initItems() {
    this.items.forEach((item, index) => {
      // Auto-assign ID if missing
      if (item.id === undefined) item.id = `accordion-item-${index}`;

      // Set up the toggle bridge
      item.onToggle = (id) => this.handleToggle(id);
    });
  }

  private handleToggle(selectedId: string | number) {
    this.items.forEach(item => {
      if (item.id === selectedId) {
        // Toggle the clicked item
        item.isOpen = !item.isOpen;
      } else if (this.type === 'single') {
        // Close others if in single mode
        item.isOpen = false;
      }
    });
  }

  protected readonly cn = cn;
}
