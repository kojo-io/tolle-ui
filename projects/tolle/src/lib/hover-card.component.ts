import { Component, Input, Output, EventEmitter, inject, TemplateRef, ViewChild, ViewContainerRef, OnDestroy, ContentChild, forwardRef, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-hover-card',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`
})
export class HoverCardComponent implements OnDestroy {
    @Input() openDelay = 700;
    @Input() closeDelay = 300;
    @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

    private openTimeout?: any;
    private closeTimeout?: any;

    isOpen = false;

    @ContentChild(forwardRef(() => HoverCardContentComponent)) contentComponent?: HoverCardContentComponent;

    open(triggerElement: HTMLElement) {
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = undefined;
        }

        if (this.isOpen) return;

        this.openTimeout = setTimeout(() => {
            this.show(triggerElement);
        }, this.openDelay);
    }

    close() {
        if (this.openTimeout) {
            clearTimeout(this.openTimeout);
            this.openTimeout = undefined;
        }

        this.closeTimeout = setTimeout(() => {
            this.hide();
        }, this.closeDelay);
    }

    private show(triggerElement: HTMLElement) {
        this.isOpen = true;
        setTimeout(() => {
            if (this.contentComponent) {
                this.contentComponent.show(triggerElement, this.placement);
            }
        });
    }

    private hide() {
        this.isOpen = false;
        if (this.contentComponent) {
            this.contentComponent.hide();
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
    imports: [CommonModule],
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
    imports: [CommonModule],
    template: `
    <div *ngIf="isVisible"
         #content
         [class]="computedClass"
         (mouseenter)="onMouseEnter()"
         (mouseleave)="onMouseLeave()">
      <ng-content></ng-content>
    </div>
  `
})
export class HoverCardContentComponent implements OnDestroy {
    @Input() class: string = '';
    @ViewChild('content') contentEl?: ElementRef;

    isVisible = false;
    private cleanup?: () => void;
    private hoverCard = inject(HoverCardComponent);

    show(triggerElement: HTMLElement, placement: any) {
        this.isVisible = true;
        setTimeout(() => {
            if (this.contentEl) {
                this.updatePosition(triggerElement, this.contentEl.nativeElement, placement);
            }
        });
    }

    hide() {
        this.isVisible = false;
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

    get computedClass() {
        return cn(
            "w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            this.class
        );
    }

    ngOnDestroy() {
        if (this.cleanup) this.cleanup();
    }
}
