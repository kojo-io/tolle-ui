import { Component, Input, Output, EventEmitter, Injectable, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';
import { BehaviorSubject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Injectable()
class CollapsibleService {
    private openSubject = new BehaviorSubject<boolean>(false);
    open$ = this.openSubject.asObservable();

    setOpen(value: boolean) {
        this.openSubject.next(value);
    }

    getOpen() {
        return this.openSubject.getValue();
    }

    toggle() {
        this.setOpen(!this.getOpen());
    }
}

@Component({
    selector: 'tolle-collapsible',
    imports: [CommonModule],
    providers: [CollapsibleService],
    template: `<ng-content></ng-content>`,
    host: {
        '[class]': 'computedClass'
    }
})
export class CollapsibleComponent {
    @Input() set open(val: boolean) {
        this.collapsibleService.setOpen(val);
    }
    @Output() openChange = new EventEmitter<boolean>();
    @Input() class: string = '';

    private collapsibleService = inject(CollapsibleService);

    ngOnInit() {
        this.collapsibleService.open$.subscribe(val => {
            this.openChange.emit(val);
        });
    }

    get computedClass() {
        return cn("w-full", this.class);
    }
}

@Component({
    selector: 'tolle-collapsible-trigger',
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    host: {
        '[attr.data-state]': 'isOpen ? "open" : "closed"',
        '(click)': 'onToggle()',
        '[class]': 'computedClass'
    }
})
export class CollapsibleTriggerComponent {
    @Input() class: string = '';

    private collapsibleService = inject(CollapsibleService);
    isOpen = false;

    constructor() {
        this.collapsibleService.open$.subscribe(open => {
            this.isOpen = open;
        });
    }

    onToggle() {
        this.collapsibleService.toggle();
    }

    get computedClass() {
        return cn("cursor-pointer", this.class);
    }
}

@Component({
    selector: 'tolle-collapsible-content',
    imports: [CommonModule],
    template: `
    <div [@expandCollapse]="isOpen ? 'open' : 'closed'" class="overflow-hidden">
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
        '[attr.data-state]': 'isOpen ? "open" : "closed"',
        '[class]': 'computedClass'
    }
})
export class CollapsibleContentComponent {
    @Input() class: string = '';

    private collapsibleService = inject(CollapsibleService);
    isOpen = false;

    constructor() {
        this.collapsibleService.open$.subscribe(open => {
            this.isOpen = open;
        });
    }

    get computedClass() {
        return cn("", this.class);
    }
}
