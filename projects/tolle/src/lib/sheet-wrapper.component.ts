import { Component, OnInit, TemplateRef, Type, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SheetRef } from './sheet-ref';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-sheet-wrapper',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div 
      [class]="computedClass" 
      [attr.data-state]="isOpen ? 'open' : 'closed'"
      (mousedown)="$event.stopPropagation()"
    >
      <!-- Header -->
      <div *ngIf="ref.config.showCloseButton !== false || ref.config.title" class="flex flex-col space-y-2 mb-4">
        <div class="flex items-center justify-between">
          <h3 *ngIf="ref.config.title" class="text-lg font-semibold text-foreground tracking-tight">
            {{ ref.config.title }}
          </h3>
          <button 
            *ngIf="ref.config.showCloseButton !== false" 
            (click)="close()" 
            class="ml-auto p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            <i class="ri-close-line text-2xl"></i>
            <span class="sr-only">Close</span>
          </button>
        </div>
        <p *ngIf="ref.config.description" class="text-sm text-muted-foreground">
          {{ ref.config.description }}
        </p>
      </div>

      <!-- Content -->
      <div class="grow overflow-y-auto">
        <ng-container [ngSwitch]="contentType">
          <div *ngSwitchCase="'string'">{{ content }}</div>

          <ng-container *ngSwitchCase="'template'">
            <ng-container *ngTemplateOutlet="asTemplate; context: ref.config.context"></ng-container>
          </ng-container>

          <ng-container *ngSwitchCase="'component'">
            <ng-container *ngComponentOutlet="asComponent"></ng-container>
          </ng-container>
        </ng-container>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: contents;
    }
  `]
})
export class SheetWrapperComponent implements OnInit {
    contentType: 'template' | 'string' | 'component' = 'string';
    content: any;
    isOpen = false;

    public ref = inject(SheetRef);

    ngOnInit() {
        this.content = this.ref.config.content;
        this.determineContentType();

        // Trigger entry animation
        setTimeout(() => {
            this.isOpen = true;
        }, 0);

        // Listen for close requests
        this.ref.afterClosed$.subscribe(() => {
            this.isOpen = false;
        });
    }

    private determineContentType() {
        if (typeof this.content === 'string') this.contentType = 'string';
        else if (this.content instanceof TemplateRef) this.contentType = 'template';
        else this.contentType = 'component';
    }

    get asTemplate() { return this.content as TemplateRef<any>; }
    get asComponent() { return this.content as Type<any>; }

    close() {
        this.ref.close();
    }

    get computedClass() {
        const side = this.ref.config.side || 'right';
        const sideClasses = {
            top: "inset-x-0 top-0 border-b slide-in-from-top data-[state=closed]:slide-out-to-top",
            bottom: "inset-x-0 bottom-0 border-t slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
            left: "inset-y-0 left-0 h-full w-3/4 border-r slide-in-from-left data-[state=closed]:slide-out-to-left sm:max-w-sm",
            right: "inset-y-0 right-0 h-full w-3/4 border-l slide-in-from-right data-[state=closed]:slide-out-to-right sm:max-w-sm",
        };

        const roundingClasses = {
            top: "rounded-b-2xl",
            bottom: "rounded-t-2xl",
            left: "rounded-r-2xl",
            right: "rounded-l-2xl",
        };

        return cn(
            "fixed z-50 flex flex-col gap-4 bg-background p-6 shadow-lg transition ease-in-out duration-300",
            sideClasses[side],
            this.ref.config.rounded && roundingClasses[side],
            this.ref.config.class
        );
    }
}
