import {
    Component, input, output, Injectable, inject, TemplateRef, ViewChild, ViewContainerRef, OnDestroy, OnInit, signal, computed, effect, model, viewChild
} from '@angular/core';

import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { cn } from './utils/cn';

@Injectable()
class AlertDialogInternalService {
    isOpen = signal(false);

    setOpen(value: boolean) {
        this.isOpen.set(value);
    }

    toggle() {
        this.isOpen.update((v: boolean) => !v);
    }
}

@Component({
    selector: 'tolle-alert-dialog',
    standalone: true,
    imports: [],
    providers: [AlertDialogInternalService],
    template: `<ng-content></ng-content>`
})
export class AlertDialogComponent {
    open = model(false);

    private alertDialogService = inject(AlertDialogInternalService);

    constructor() {
        effect(() => {
            this.alertDialogService.setOpen(this.open());
        });

        effect(() => {
            this.open.set(this.alertDialogService.isOpen());
        });
    }
}

@Component({
    selector: 'tolle-alert-dialog-trigger',
    standalone: true,
    imports: [],
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
    imports: [],
    template: `
    <ng-template #portalContent>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class AlertDialogPortalComponent implements OnDestroy {
    portalContent = viewChild<TemplateRef<any>>('portalContent');
    private alertDialogService = inject(AlertDialogInternalService);
    private overlay = inject(Overlay);
    private viewContainerRef = inject(ViewContainerRef);
    private overlayRef?: OverlayRef;

    constructor() {
        effect(() => {
            if (this.alertDialogService.isOpen()) {
                this.show();
            } else {
                this.hide();
            }
        });
    }

    private show() {
        if (this.overlayRef) return;
        const content = this.portalContent();
        if (!content) return;

        const config = new OverlayConfig({
            hasBackdrop: true,
            backdropClass: ['cdk-overlay-backdrop', 'bg-black/80', 'backdrop-blur-sm', 'data-[state=open]:animate-in', 'data-[state=closed]:animate-out', 'data-[state=closed]:fade-out-0', 'data-[state=open]:fade-in-0'],
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
            scrollStrategy: this.overlay.scrollStrategies.block()
        });

        this.overlayRef = this.overlay.create(config);
        this.overlayRef.backdropClick().subscribe(() => this.alertDialogService.setOpen(false));

        const portal = new TemplatePortal(content, this.viewContainerRef);
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
    imports: [],
    template: `<div [class]="computedClass()" [attr.data-state]="isOpen() ? 'open' : 'closed'"><ng-content></ng-content></div>`,
    host: {
        '[class]': '"contents"'
    }
})
export class AlertDialogContentComponent {
    className = input('', { alias: 'class' });

    private alertDialogService = inject(AlertDialogInternalService);
    isOpen = computed(() => this.alertDialogService.isOpen());

    computedClass = computed(() => cn(
        "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] rounded-lg",
        this.className()
    ));
}

@Component({
    selector: 'tolle-alert-dialog-header',
    standalone: true,
    imports: [],
    template: `<ng-content></ng-content>`,
    host: { '[class]': 'computedClass()' }
})
export class AlertDialogHeaderComponent {
    className = input('', { alias: 'class' });
    computedClass = computed(() => cn("flex flex-col space-y-2 text-center sm:text-left", this.className()));
}

@Component({
    selector: 'tolle-alert-dialog-footer',
    standalone: true,
    imports: [],
    template: `<ng-content></ng-content>`,
    host: { '[class]': 'computedClass()' }
})
export class AlertDialogFooterComponent {
    className = input('', { alias: 'class' });
    computedClass = computed(() => cn("flex flex-row justify-end space-x-2", this.className()));
}

@Component({
    selector: 'tolle-alert-dialog-title',
    standalone: true,
    imports: [],
    template: `<ng-content></ng-content>`,
    host: { '[class]': 'computedClass()' }
})
export class AlertDialogTitleComponent {
    className = input('', { alias: 'class' });
    computedClass = computed(() => cn("text-lg font-semibold", this.className()));
}

@Component({
    selector: 'tolle-alert-dialog-description',
    standalone: true,
    imports: [],
    template: `<ng-content></ng-content>`,
    host: { '[class]': 'computedClass()' }
})
export class AlertDialogDescriptionComponent {
    className = input('', { alias: 'class' });
    computedClass = computed(() => cn("text-sm text-muted-foreground", this.className()));
}

@Component({
    selector: 'tolle-alert-dialog-action',
    standalone: true,
    imports: [],
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
    imports: [],
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
