import { Component, input, contentChildren, effect } from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-accordion',
  standalone: true,
  imports: [],
  template: `
    <div [class]="cn('w-full', className())">
      <ng-content></ng-content>
    </div>
  `
})
export class AccordionComponent {
  type = input<'single' | 'multiple'>('single');
  className = input('', { alias: 'class' });

  items = contentChildren(AccordionItemComponent);

  constructor() {
    effect(() => {
      this.initItems();
    });
  }

  private initItems() {
    this.items().forEach((item: AccordionItemComponent) => {
      // Set up the toggle bridge
      item.onToggle = (id) => this.handleToggle(id);
    });
  }

  private handleToggle(selectedId: string | number) {
    this.items().forEach((item: AccordionItemComponent) => {
      if (item.id() === selectedId) {
        item.isOpen.set(!item.isOpen());
      } else if (this.type() === 'single') {
        item.isOpen.set(false);
      }
    });
  }

  protected readonly cn = cn;
}
