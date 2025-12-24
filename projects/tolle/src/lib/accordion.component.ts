import { Component, Input, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionItemComponent } from './accordion-item.component';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cn('w-full border-t border-border', class)">
      <ng-content></ng-content>
    </div>
  `
})
export class AccordionComponent implements AfterContentInit {
  @Input() type: 'single' | 'multiple' = 'single';
  @Input() class: string = '';

  @ContentChildren(AccordionItemComponent) items!: QueryList<AccordionItemComponent>;

  ngAfterContentInit() {
    this.items.forEach((item, index) => {
      // Assign unique ID if none provided
      if (item.id === undefined) item.id = index;

      // Hook into the item's toggle event
      item.onToggle = (id) => this.handleToggle(id);
    });
  }

  private handleToggle(selectedId: string | number) {
    this.items.forEach(item => {
      if (item.id === selectedId) {
        item.isOpen = !item.isOpen;
      } else {
        // If type is 'single', close all other items
        if (this.type === 'single') {
          item.isOpen = false;
        }
      }
    });
  }

  protected readonly cn = cn;
}
