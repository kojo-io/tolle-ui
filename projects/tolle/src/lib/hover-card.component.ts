import { Component, input, inject, viewChild, OnDestroy, contentChild, ElementRef, signal, computed, effect } from '@angular/core';

import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-hover-card',
    standalone: true,
    imports: [],
    template: `<ng-content></ng-content>`
})
export class HoverCardComponent implements OnDestroy {
    openDelay = input(700);
    closeDelay = input(300);
    placement = input<'top' | 'bottom' | 'left' | 'right'>('bottom');

    private openTimeout?: any;
    private closeTimeout?: any;

    isOpen = signal(false);

    contentComponent = contentChild<HoverCardContentComponent>(HoverCardContentComponent);

    open(triggerElement: HTMLElement) {
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = undefined;
        }

        if (this.isOpen()) return;

        this.openTimeout = setTimeout(() => {
            this.show(triggerElement);
        }, this.openDelay());
    }

    close() {
        if (this.openTimeout) {
            clearTimeout(this.openTimeout);
            this.openTimeout = undefined;
        }

        this.closeTimeout = setTimeout(() => {
            this.hide();
        }, this.closeDelay());
    }

    private show(triggerElement: HTMLElement) {
        this.isOpen.set(true);
        setTimeout(() => {
            const content = this.contentComponent();
            if (content) {
                content.show(triggerElement, this.placement());
            }
        });
    }

    private hide() {
        this.isOpen.set(false);
        const content = this.contentComponent();
        if (content) {
            content.hide();
        }
    }

    ngOnDestroy() {
        this.hide();
        if (this.openTimeout) clearTimeout(this.openTimeout);
        if (this.closeTimeout) clearTimeout(this.closeTimeout);
    }
}

@Component({
    selector: 'tolle-hover-card-trigger',
    standalone: true,
    imports: [],
    template: `<ng-content></ng-content>`,
    host: {
        '(mouseenter)': 'onMouseEnter()',
        '(mouseleave)': 'onMouseLeave()',
        '[class]': '"cursor-default inline-block"'
    }
})
export class HoverCardTriggerComponent {
    private hoverCard = inject(HoverCardComponent);
    private elementRef = inject(ElementRef);

    onMouseEnter() {
        this.hoverCard.open(this.elementRef.nativeElement);
    }

    onMouseLeave() {
        this.hoverCard.close();
    }
}

@Component({
    selector: 'tolle-hover-card-content',
    standalone: true,
    imports: [],
    template: `
    @if (isVisible()) {
      <div
        #content
        [class]="computedClass()"
        (mouseenter)="onMouseEnter()"
        (mouseleave)="onMouseLeave()">
        <ng-content></ng-content>
      </div>
    }
    `
})
export class HoverCardContentComponent implements OnDestroy {
    class = input<string>('');
    contentEl = viewChild<ElementRef>('content');

    isVisible = signal(false);
    private cleanup?: () => void;
    private hoverCard = inject(HoverCardComponent);

    show(triggerElement: HTMLElement, placement: any) {
        this.isVisible.set(true);
        setTimeout(() => {
            const el = this.contentEl();
            if (el) {
                this.updatePosition(triggerElement, el.nativeElement, placement);
            }
        });
    }

    hide() {
        this.isVisible.set(false);
        if (this.cleanup) {
            this.cleanup();
            this.cleanup = undefined;
        }
    }

    private updatePosition(trigger: HTMLElement, content: HTMLElement, placement: any) {
        this.cleanup = autoUpdate(trigger, content, () => {
            computePosition(trigger, content, {
                placement,
                middleware: [offset(8), flip(), shift({ padding: 8 })],
            }).then(({ x, y }) => {
                Object.assign(content.style, {
                    position: 'fixed',
                    left: `${x}px`,
                    top: `${y}px`,
                    zIndex: '9999'
                });
            });
        });
    }

    onMouseEnter() {
        this.hoverCard.open(null as any);
    }

    onMouseLeave() {
        this.hoverCard.close();
    }

    computedClass = computed(() => {
        return cn(
            "w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            this.class()
        );
    });

    ngOnDestroy() {
        if (this.cleanup) this.cleanup();
    }
}
