import { Component, input, output, Injectable, inject, signal, computed, OnInit, effect } from '@angular/core';

import { cn } from './utils/cn';

@Injectable()
class TabsService {
    activeTab = signal<string | null>(null);

    setActiveTab(value: string) {
        this.activeTab.set(value);
    }

    getActiveTab() {
        return this.activeTab();
    }
}

@Component({
    selector: 'tolle-tabs',
    standalone: true,
    imports: [],
    providers: [TabsService],
    template: `<ng-content></ng-content>`,
    host: {
        '[class]': 'computedClass()'
    }
})
export class TabsComponent implements OnInit {
    defaultValue = input<string | undefined>();
    value = input<string | undefined>();
    valueChange = output<string>();
    class = input<string>('');

    private tabsService = inject(TabsService);

    constructor() {
        // Sync external value changes to the service
        effect(() => {
            const v = this.value();
            if (v !== undefined) {
                this.tabsService.setActiveTab(v);
            }
        });

        // Sync service changes to the output
        effect(() => {
            const v = this.tabsService.activeTab();
            if (v && v !== this.value()) {
                this.valueChange.emit(v);
            }
        });
    }

    ngOnInit() {
        if (this.value() !== undefined) {
            this.tabsService.setActiveTab(this.value()!);
        } else if (this.defaultValue() !== undefined) {
            this.tabsService.setActiveTab(this.defaultValue()!);
        }
    }

    computedClass = computed(() => cn("w-full", this.class()));
}

@Component({
    selector: 'tolle-tabs-list',
    standalone: true,
    imports: [],
    template: `<ng-content></ng-content>`,
    host: {
        '[class]': 'computedClass()'
    }
})
export class TabsListComponent {
    class = input<string>('');
    variant = input<'default' | 'underline'>('default');

    computedClass = computed(() => {
        if (this.variant() === 'underline') {
            return cn(
                "flex h-10 items-center justify-start border-b border-border w-full bg-transparent p-0 text-muted-foreground gap-8",
                this.class()
            );
        }
        return cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            this.class()
        );
    });
}

@Component({
    selector: 'tolle-tabs-trigger',
    standalone: true,
    imports: [],
    template: `<ng-content></ng-content>`,
    host: {
        'role': 'tab',
        '[attr.aria-selected]': 'isActive()',
        '[attr.data-state]': 'isActive() ? "active" : "inactive"',
        '(click)': 'onActivate()',
        '[class]': 'computedClass()'
    }
})
export class TabsTriggerComponent {
    value = input.required<string>();
    class = input<string>('');

    private tabsService = inject(TabsService);
    private tabsList = inject(TabsListComponent, { optional: true });

    isActive = computed(() => this.tabsService.activeTab() === this.value());

    onActivate() {
        this.tabsService.setActiveTab(this.value());
    }

    computedClass = computed(() => {
        if (this.tabsList?.variant() === 'underline') {
            return cn(
                "inline-flex items-center justify-center whitespace-nowrap py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground hover:text-foreground/80 -mb-[1px]",
                this.class()
            );
        }
        return cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
            this.class()
        );
    });
}

@Component({
    selector: 'tolle-tabs-content',
    standalone: true,
    imports: [],
    template: `@if (isActive()) {<div><ng-content></ng-content></div>}`,
    host: {
        'role': 'tabpanel',
        '[attr.data-state]': 'isActive() ? "active" : "inactive"',
        '[class]': 'computedClass()'
    }
})
export class TabsContentComponent {
    value = input.required<string>();
    class = input<string>('');

    private tabsService = inject(TabsService);
    isActive = computed(() => this.tabsService.activeTab() === this.value());

    computedClass = computed(() => {
        return cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            this.class()
        );
    });
}
