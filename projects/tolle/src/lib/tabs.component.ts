import { Component, Input, Output, EventEmitter, Injectable, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';
import { BehaviorSubject } from 'rxjs';

@Injectable()
class TabsService {
    private activeTabSubject = new BehaviorSubject<string | null>(null);
    activeTab$ = this.activeTabSubject.asObservable();

    setActiveTab(value: string) {
        this.activeTabSubject.next(value);
    }

    getActiveTab() {
        return this.activeTabSubject.getValue();
    }
}

@Component({
    selector: 'tolle-tabs',
    standalone: true,
    imports: [CommonModule],
    providers: [TabsService],
    template: `<ng-content></ng-content>`,
    host: {
        '[class]': 'computedClass'
    }
})
export class TabsComponent {
    @Input() defaultValue?: string;
    @Input() value?: string;
    @Output() valueChange = new EventEmitter<string>();
    @Input() class: string = '';

    private tabsService = inject(TabsService);

    ngOnInit() {
        if (this.value) {
            this.tabsService.setActiveTab(this.value);
        } else if (this.defaultValue) {
            this.tabsService.setActiveTab(this.defaultValue);
        }

        this.tabsService.activeTab$.subscribe(val => {
            if (val && val !== this.value) {
                this.value = val;
                this.valueChange.emit(val);
            }
        });
    }

    get computedClass() {
        return cn("w-full", this.class);
    }
}

@Component({
    selector: 'tolle-tabs-list',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    host: {
        '[class]': 'computedClass'
    }
})
export class TabsListComponent {
    @Input() class: string = '';
    @Input() variant: 'default' | 'underline' = 'default';

    get computedClass() {
        if (this.variant === 'underline') {
            return cn(
                "flex h-10 items-center justify-start border-b border-border w-full bg-transparent p-0 text-muted-foreground gap-8",
                this.class
            );
        }
        return cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            this.class
        );
    }
}

@Component({
    selector: 'tolle-tabs-trigger',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    host: {
        'role': 'tab',
        '[attr.aria-selected]': 'isActive',
        '[attr.data-state]': 'isActive ? "active" : "inactive"',
        '(click)': 'onActivate()',
        '[class]': 'computedClass'
    }
})
export class TabsTriggerComponent {
    @Input({ required: true }) value!: string;
    @Input() class: string = '';

    private tabsService = inject(TabsService);
    private tabsList = inject(TabsListComponent, { optional: true });
    isActive = false;

    constructor() {
        this.tabsService.activeTab$.subscribe(active => {
            this.isActive = active === this.value;
        });
    }

    onActivate() {
        this.tabsService.setActiveTab(this.value);
    }

    get computedClass() {
        if (this.tabsList?.variant === 'underline') {
            return cn(
                "inline-flex items-center justify-center whitespace-nowrap py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground hover:text-foreground/80 -mb-[1px]",
                this.class
            );
        }
        return cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
            this.class
        );
    }
}

@Component({
    selector: 'tolle-tabs-content',
    standalone: true,
    imports: [CommonModule],
    template: `<div *ngIf="isActive"><ng-content></ng-content></div>`,
    host: {
        'role': 'tabpanel',
        '[attr.data-state]': 'isActive ? "active" : "inactive"',
        '[class]': 'computedClass'
    }
})
export class TabsContentComponent {
    @Input({ required: true }) value!: string;
    @Input() class: string = '';

    private tabsService = inject(TabsService);
    isActive = false;

    constructor() {
        this.tabsService.activeTab$.subscribe(active => {
            this.isActive = active === this.value;
        });
    }

    get computedClass() {
        return cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            this.class
        );
    }
}
