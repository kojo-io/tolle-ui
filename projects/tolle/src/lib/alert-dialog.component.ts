import { Component, Input, Output, EventEmitter, Injectable, inject, TemplateRef, ViewChild, ViewContainerRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal, ComponentPortal } from '@angular/cdk/portal';
import { cn } from './utils/cn';
import { BehaviorSubject } from 'rxjs';

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

        const config = new OverlayConfig({
            hasBackdrop: true,
            backdropClass: ['cdk-overlay-backdrop', 'bg-black/80', 'backdrop-blur-sm', 'data-[state=open]:animate-in', 'data-[state=closed]:animate-out', 'data-[state=closed]:fade-out-0', 'data-[state=open]:fade-in-0'],
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
            scrollStrategy: this.overlay.scrollStrategies.block()
        });

        this.overlayRef = this.overlay.create(config);
        this.overlayRef.backdropClick().subscribe(() => this.alertDialogService.setOpen(false));

        const portal = new TemplatePortal(this.portalContent, this.viewContainerRef);
        this.overlayRef.attach(portal);
    }

    private hide() {
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
            this.overlayRef = undefined;
        }
    }

    ngOnDestroy() {
        this.hide();
    }
}

@Component({
    selector: 'tolle-alert-dialog-content',
    standalone: true,
    imports: [CommonModule],
    template: `<div [class]="computedClass" [attr.data-state]="isOpen ? 'open' : 'closed'"><ng-content></ng-content></div>`,
    host: {
        '[class]': '"contents"'
    }
})
export class AlertDialogContentComponent {
    @Input() class: string = '';

    private alertDialogService = inject(AlertDialogInternalService);
    isOpen = false;

    constructor() {
        this.alertDialogService.open$.subscribe(val => {
            this.isOpen = val;
        });
    }

    get computedClass() {
        return cn(
            "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 grid w-full max-w-lg gap-4 border border-input bg-background p-6 shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] rounded-lg",
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
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    host: { '[class]': 'computedClass' }
})
export class AlertDialogTitleComponent {
    @Input() class: string = '';
    get computedClass() { return cn("text-lg font-semibold text-foreground", this.class); }
}

@Component({
    selector: 'tolle-alert-dialog-description',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    host: { '[class]': 'computedClass' }
})
export class AlertDialogDescriptionComponent {
    @Input() class: string = '';
    get computedClass() { return cn("text-sm text-muted-foreground", this.class); }
}

@Component({
    selector: 'tolle-alert-dialog-action',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    host: {
        '(click)': 'onAction()'
    }
})
export class AlertDialogActionComponent {
    private alertDialogService = inject(AlertDialogInternalService);
    onAction() {
        this.alertDialogService.setOpen(false);
    }
}

@Component({
    selector: 'tolle-alert-dialog-cancel',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    host: {
        '(click)': 'onCancel()'
    }
})
export class AlertDialogCancelComponent {
    private alertDialogService = inject(AlertDialogInternalService);
    onCancel() {
        this.alertDialogService.setOpen(false);
    }
}
