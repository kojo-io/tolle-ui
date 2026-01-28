import { Component, input, output, Injectable, inject, OnInit, computed, effect, signal } from '@angular/core';

import { cn } from './utils/cn';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Injectable()
class CollapsibleService {
    isOpen = signal(false);

    setOpen(value: boolean) {
        this.isOpen.set(value);
    }

    toggle() {
        this.isOpen.update(v => !v);
    }
}

@Component({
    selector: 'tolle-collapsible',
    standalone: true,
    imports: [],
    providers: [CollapsibleService],
    template: `<ng-content></ng-content>`,
    host: {
        '[class]': 'computedClass()'
    }
})
export class CollapsibleComponent {
    open = input<boolean>(false);
    openChange = output<boolean>();
    className = input('', { alias: 'class' });

    private collapsibleService = inject(CollapsibleService);

    constructor() {
        // Sync initial input to service
        effect(() => {
            this.collapsibleService.setOpen(this.open());
        });

        // Sync service back to output
        effect(() => {
            this.openChange.emit(this.collapsibleService.isOpen());
        });
    }

    computedClass = computed(() => cn("w-full", this.className()));
}

@Component({
    selector: 'tolle-collapsible-trigger',
    standalone: true,
    imports: [],
    template: `<ng-content></ng-content>`,
    host: {
        '[attr.data-state]': 'isOpen() ? "open" : "closed"',
        '(click)': 'onToggle()',
        '[class]': 'computedClass()'
    }
})
export class CollapsibleTriggerComponent {
    className = input('', { alias: 'class' });

    private collapsibleService = inject(CollapsibleService);
    isOpen = computed(() => this.collapsibleService.isOpen());

    onToggle() {
        this.collapsibleService.toggle();
    }

    computedClass = computed(() => cn("cursor-pointer", this.className()));
}

@Component({
    selector: 'tolle-collapsible-content',
    standalone: true,
    imports: [],
    template: `
    <div [@expandCollapse]="isOpen() ? 'open' : 'closed'" class="overflow-hidden">
      <ng-content></ng-content>
    </div>
  `,
    animations: [
        trigger('expandCollapse', [
            state('closed', style({ height: '0px', opacity: 0 })),
            state('open', style({ height: '*', opacity: 1 })),
            transition('closed <=> open', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
        ])
    ],
    host: {
        '[attr.data-state]': 'isOpen() ? "open" : "closed"',
        '[class]': 'computedClass()'
    }
})
export class CollapsibleContentComponent {
    className = input('', { alias: 'class' });

    private collapsibleService = inject(CollapsibleService);
    isOpen = computed(() => this.collapsibleService.isOpen());

    computedClass = computed(() => cn("", this.className()));
}
