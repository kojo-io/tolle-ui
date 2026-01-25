import { Component, Input, Output, EventEmitter, inject, TemplateRef, ViewChild, ViewContainerRef, OnDestroy, ContentChild, forwardRef, ElementRef, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayRef, OverlayConfig, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-sheet',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`
})
export class SheetComponent {
  @Input() isOpen = false;
  @Input() hasBackdrop = true;
  @Output() isOpenChange = new EventEmitter<boolean>();

  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private scrollStrategy = inject(ScrollStrategyOptions);

  private overlayRef?: OverlayRef;

  @ContentChild(forwardRef(() => SheetContentComponent)) contentComponent?: any;

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.isOpenChange.emit(true);
    this.show();
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.hide();
  }

  private show() {
    if (this.overlayRef || !this.contentComponent?.contentTemplate) return;

    const overlayConfig = new OverlayConfig({
      hasBackdrop: this.hasBackdrop,
      backdropClass: 'tolle-modal-backdrop',
      scrollStrategy: this.scrollStrategy.block(),
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically() // This centers key, but sheet is fixed via classes
    });

    this.overlayRef = this.overlay.create(overlayConfig);

    const portal = new TemplatePortal(this.contentComponent.contentTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    if (this.hasBackdrop) {
      this.overlayRef.backdropClick().subscribe(() => this.close());
    }
  }

  private hide() {
    if (this.overlayRef) {
      setTimeout(() => {
        if (this.overlayRef) {
          this.overlayRef.detach();
          this.overlayRef.dispose();
          this.overlayRef = undefined;
        }
      }, 300);
    }
  }

  ngOnDestroy() {
    // Immediate cleanup on destroy
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}

@Component({
  selector: 'tolle-sheet-trigger',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  host: {
    '(click)': 'onClick()',
    'class': 'inline-block'
  }
})
export class SheetTriggerComponent {
  private sheet = inject(SheetComponent);

  onClick() {
    this.sheet.open();
  }
}

@Component({
  selector: 'tolle-sheet-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-template #sheetContent>
      <div 
        [class]="computedClass" 
        [attr.data-state]="sheet.isOpen ? 'open' : 'closed'"
        (mousedown)="$event.stopPropagation()">
        <button 
          (click)="close()" 
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <i class="ri-close-line text-xl"></i>
          <span class="sr-only">Close</span>
        </button>
        <ng-content></ng-content>
      </div>
    </ng-template>
  `
})
export class SheetContentComponent {
  @Input() side: 'top' | 'bottom' | 'left' | 'right' = 'right';
  @Input() rounded: boolean = false;
  @Input() class: string = '';

  @ViewChild('sheetContent', { static: true }) contentTemplate!: TemplateRef<any>;

  public sheet = inject(SheetComponent);

  close() {
    this.sheet.close();
  }

  get computedClass() {
    const sideClasses = {
      top: "inset-x-0 top-0 border-b data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
      bottom: "inset-x-0 bottom-0 border-t data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
      right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
    };

    const roundingClasses = {
      top: "rounded-b-2xl",
      bottom: "rounded-t-2xl",
      left: "rounded-r-2xl",
      right: "rounded-l-2xl",
    };

    return cn(
      "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-500 data-[state=closed]:duration-300",
      sideClasses[this.side],
      this.rounded && roundingClasses[this.side],
      this.class
    );
  }
}

@Component({
  selector: 'tolle-sheet-header',
  standalone: true,
  template: `
    <div class="flex flex-col space-y-2 text-center sm:text-left">
      <ng-content></ng-content>
    </div>
  `
})
export class SheetHeaderComponent { }

@Component({
  selector: 'tolle-sheet-footer',
  standalone: true,
  template: `
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <ng-content></ng-content>
    </div>
  `
})
export class SheetFooterComponent { }

@Component({
  selector: 'tolle-sheet-title',
  standalone: true,
  template: `
    <h3 class="text-lg font-semibold text-foreground">
      <ng-content></ng-content>
    </h3>
  `
})
export class SheetTitleComponent { }

@Component({
  selector: 'tolle-sheet-description',
  standalone: true,
  template: `
    <p class="text-sm text-muted-foreground">
      <ng-content></ng-content>
    </p>
  `
})
export class SheetDescriptionComponent { }
