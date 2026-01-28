import { Component, input, model } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-accordion-item',
  standalone: true,
  imports: [],
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
    <div [class]="cn('flex flex-col border-b border-border', className())">
      <button
        type="button"
        (click)="toggle()"
        [attr.aria-expanded]="isOpen()"
        [attr.data-state]="isOpen() ? 'open' : 'closed'"
        class="flex flex-1 items-center justify-between py-4 font-medium transition-all group [&[data-state=open]>i]:rotate-180"
      >
        <span class="text-left group-hover:underline">{{ title() }}</span>
        <i class="ri-arrow-down-s-line text-muted-foreground text-lg transition-transform duration-200 hover:no-underline"></i>
      </button>
  
      <div
        [@expandCollapse]="isOpen() ? 'expanded' : 'collapsed'"
        class="overflow-hidden">
        <div class="pb-4 pt-0 text-sm text-muted-foreground">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
    `
})
export class AccordionItemComponent {
  title = input<string>('');
  className = input('', { alias: 'class' });
  id = input<string | number>(Math.random().toString(36).substring(2, 9));

  isOpen = model(false);

  // This will be set by the parent Accordion component
  onToggle?: (id: string | number) => void;

  toggle() {
    if (this.onToggle) {
      this.onToggle(this.id());
    } else {
      this.isOpen.update(v => !v);
    }
  }

  protected readonly cn = cn;
}
