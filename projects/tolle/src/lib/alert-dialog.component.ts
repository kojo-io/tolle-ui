import { Component, Input, Output, EventEmitter, HostListener, Injectable, inject, TemplateRef, ViewChild, ViewContainerRef, OnDestroy, OnInit, ContentChild, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal, ComponentPortal } from '@angular/cdk/portal';
import { A11yModule } from '@angular/cdk/a11y';
import { cn } from './utils/cn';
import { BehaviorSubject } from 'rxjs';
import { AlertDialogSize } from './alert-dialog.types';

@Injectable()
class AlertDialogInternalService {
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
    selector: 'tolle-alert-dialog',
  styles: [':host { display: block; }'],
    standalone: true,
    imports: [CommonModule],
    providers: [AlertDialogInternalService],
    template: `<ng-content></ng-content>`
})
export class AlertDialogComponent {
    @Input() set open(val: boolean) {
        this.alertDialogService.setOpen(val);
    }
    @Output() openChange = new EventEmitter<boolean>();

    private alertDialogService = inject(AlertDialogInternalService);

    constructor() {
        this.alertDialogService.open$.subscribe(val => {
            this.openChange.emit(val);
        });
    }
}

@Component({
    selector: 'tolle-alert-dialog-trigger',
  styles: [':host { display: block; }'],
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    host: {
        '(click)': 'onOpen()'
    }
})
export class AlertDialogTriggerComponent {
    private alertDialogService = inject(AlertDialogInternalService);

    onOpen() {
        this.alertDialogService.setOpen(true);
    }
}

@Component({
    selector: 'tolle-alert-dialog-portal',
  styles: [':host { display: block; }'],
    standalone: true,
    imports: [CommonModule],
    template: `
    <ng-template #portalContent>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class AlertDialogPortalComponent implements OnInit, OnDestroy {
    @ViewChild('portalContent', { static: true }) portalContent!: TemplateRef<any>;
    private alertDialogService = inject(AlertDialogInternalService);
    private overlay = inject(Overlay);
    private viewContainerRef = inject(ViewContainerRef);
    private overlayRef?: OverlayRef;
    /** Element focused before the dialog opened, restored on close. */
    private previouslyFocused?: HTMLElement | null;

    ngOnInit() {
        this.alertDialogService.open$.subscribe(open => {
            if (open) {
                this.show();
            } else {
                this.hide();
            }
        });
    }

    private show() {
        if (this.overlayRef) return;

        // Remember the trigger so focus can be restored on close.
        this.previouslyFocused = document.activeElement as HTMLElement | null;

        const config = new OverlayConfig({
            hasBackdrop: true,
            backdropClass: ['cdk-overlay-backdrop', 'bg-black/80', 'backdrop-blur-sm', 'data-[state=open]:animate-in', 'data-[state=closed]:animate-out', 'data-[state=closed]:fade-out-0', 'data-[state=open]:fade-in-0'],
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
            scrollStrategy: this.overlay.scrollStrategies.block()
        });

        this.overlayRef = this.overlay.create(config);

        // Alert-dialog semantics: backdrop clicks must NOT dismiss.
        // Escape still closes the dialog.
        this.overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                this.alertDialogService.setOpen(false);
            }
        });

        const portal = new TemplatePortal(this.portalContent, this.viewContainerRef);
        this.overlayRef.attach(portal);
    }

    private hide() {
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
            this.overlayRef = undefined;
            // Restore focus to the trigger.
            this.previouslyFocused?.focus?.();
        }
    }

    ngOnDestroy() {
        this.hide();
    }
}

@Component({
    selector: 'tolle-alert-dialog-content',
    standalone: true,
    imports: [CommonModule, A11yModule],
    template: `<div [class]="computedClass" [attr.data-state]="isOpen ? 'open' : 'closed'"
        role="alertdialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleCmp?.id || null"
        [attr.aria-describedby]="descriptionCmp?.id || null"
        cdkTrapFocus cdkTrapFocusAutoCapture><ng-content></ng-content></div>`,
    host: {
        '[class]': '"contents"'
    }
})
export class AlertDialogContentComponent {
    @Input() class: string = '';
    @Input() size: AlertDialogSize = 'lg';

    /** Projected title/description used to build the dialog's accessible name. */
    @ContentChild(forwardRef(() => AlertDialogTitleComponent)) titleCmp?: AlertDialogTitleComponent;
    @ContentChild(forwardRef(() => AlertDialogDescriptionComponent)) descriptionCmp?: AlertDialogDescriptionComponent;

    private alertDialogService = inject(AlertDialogInternalService);
    isOpen = false;

    constructor() {
        this.alertDialogService.open$.subscribe(val => {
            this.isOpen = val;
        });
    }

    get computedClass() {
        return cn(
            "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 grid w-full gap-4 border border-input bg-background p-6 shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] rounded-lg",
            {
                'max-w-xs': this.size === 'xs',
                'max-w-sm': this.size === 'sm',
                'max-w-md': this.size === 'md',
                'max-w-lg': this.size === 'lg',
                'max-w-xl': this.size === 'xl',
                'max-w-2xl': this.size === '2xl',
                'max-w-full': this.size === 'full',
                'max-w-fit': this.size === 'fit',
            },
            this.class
        );
    }
}

@Component({
    selector: 'tolle-alert-dialog-header',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    host: { '[class]': 'computedClass' }
})
export class AlertDialogHeaderComponent {
    @Input() class: string = '';
    get computedClass() { return cn("flex flex-col space-y-2 text-center sm:text-left", this.class); }
}

@Component({
    selector: 'tolle-alert-dialog-footer',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    host: { '[class]': 'computedClass' }
})
export class AlertDialogFooterComponent {
    @Input() class: string = '';
    get computedClass() { return cn("flex flex-row justify-end space-x-2", this.class); }
}

@Component({
    selector: 'tolle-alert-dialog-title',
    styles: [':host { display: block; }'],
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    host: { '[class]': 'computedClass', '[attr.id]': 'id' }
})
export class AlertDialogTitleComponent {
    @Input() class: string = '';
    /** Stable id referenced by the dialog's `aria-labelledby`. */
    readonly id = `tolle-alert-dialog-title-${Math.random().toString(36).substr(2, 9)}`;
    get computedClass() { return cn("text-lg font-semibold text-foreground", this.class); }
}

@Component({
    selector: 'tolle-alert-dialog-description',
    styles: [':host { display: block; }'],
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    host: { '[class]': 'computedClass', '[attr.id]': 'id' }
})
export class AlertDialogDescriptionComponent {
    @Input() class: string = '';
    /** Stable id referenced by the dialog's `aria-describedby`. */
    readonly id = `tolle-alert-dialog-description-${Math.random().toString(36).substr(2, 9)}`;
    get computedClass() { return cn("text-sm text-muted-foreground", this.class); }
}

@Component({
    selector: 'tolle-alert-dialog-action',
  styles: [':host { display: block; }'],
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`
})
export class AlertDialogActionComponent {
    private alertDialogService = inject(AlertDialogInternalService, { optional: true });

    /** Fires before the dialog closes, so consumers can run the confirmed action. */
    @Output() confirmed = new EventEmitter<MouseEvent>();

    @HostListener('click', ['$event'])
    handleClick(event: MouseEvent) {
        this.confirmed.emit(event);
        this.alertDialogService?.setOpen(false);
    }
}

@Component({
    selector: 'tolle-alert-dialog-cancel',
  styles: [':host { display: block; }'],
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`
})
export class AlertDialogCancelComponent {
    private alertDialogService = inject(AlertDialogInternalService, { optional: true });

    /** Fires before the dialog closes, so consumers can react to a dismissal. */
    @Output() cancelled = new EventEmitter<MouseEvent>();

    @HostListener('click', ['$event'])
    handleClick(event: MouseEvent) {
        this.cancelled.emit(event);
        this.alertDialogService?.setOpen(false);
    }
}
