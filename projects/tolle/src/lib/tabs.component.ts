import { Component, Input, Output, EventEmitter, Injectable, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';
import { BehaviorSubject } from 'rxjs';

const tabsListVariants = cva('', {
  variants: {
    variant: {
      default: 'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      underline: 'flex h-10 items-center justify-start border-b border-border w-full bg-transparent p-0 text-muted-foreground gap-8',
    },
  },
  defaultVariants: { variant: 'default' },
});

export type TabsListProps = VariantProps<typeof tabsListVariants>;

const tabsTriggerVariants = cva(
  'inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'rounded-sm px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        underline: 'py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground hover:text-foreground/80 -mb-[1px]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

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
    /** Extra Tailwind classes merged onto the tabs list via `cn()` (last-wins). */
    @Input() class: string = '';
    /** Visual style of the tab list. @default 'default' */
    @Input() variant: TabsListProps['variant'] = 'default';

    get computedClass() {
        return cn(tabsListVariants({ variant: this.variant }), this.class);
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
        const variant = this.tabsList?.variant === 'underline' ? 'underline' : 'default';
        return cn(tabsTriggerVariants({ variant }), this.class);
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
