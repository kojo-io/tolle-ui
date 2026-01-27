import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-accordion-item',
    imports: [CommonModule],
    animations: [
        trigger('expandCollapse', [
            state('collapsed', style({
                height: '0px',
                opacity: '0',
                overflow: 'hidden',
                visibility: 'hidden'
            })),
            state('expanded', style({
                height: '*', // "Star" means actual content height
                opacity: '1',
                overflow: 'hidden',
                visibility: 'visible'
            })),
            // Use cubic-bezier to match Tailwind/shadcn-ui default ease
            transition('collapsed <=> expanded', [
                animate('300ms cubic-bezier(0.87, 0, 0.13, 1)')
            ])
        ])
    ],
    template: `
    <div [class]="cn('flex flex-col border-b border-border', class)">
      <button
        type="button"
        (click)="toggle()"
        [attr.aria-expanded]="isOpen"
        [attr.data-state]="isOpen ? 'open' : 'closed'"
        class="flex flex-1 items-center justify-between py-4 font-medium transition-all group [&[data-state=open]>i]:rotate-180"
      >
        <span class="text-left group-hover:underline">{{ title }}</span>
        <i class="ri-arrow-down-s-line text-muted-foreground text-lg transition-transform duration-200 hover:no-underline"></i>
      </button>

      <div
        [@expandCollapse]="isOpen ? 'expanded' : 'collapsed'"
        class="overflow-hidden">
        <div class="pb-4 pt-0 text-sm text-muted-foreground">
          <ng-content></ng-content>
        </div>
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
