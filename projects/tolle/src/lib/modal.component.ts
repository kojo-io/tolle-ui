import { Component, OnInit, TemplateRef, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef } from './modal-ref';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="modalClasses" class="pointer-events-auto" (mousedown)="$event.stopPropagation()">

      <!-- Header -->
      <div *ngIf="hasHeader" class="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 pb-4">
        <h2 *ngIf="ref.modal.title" class="text-lg font-semibold leading-none tracking-tight text-foreground">
          {{ ref.modal.title }}
        </h2>
        <button
          *ngIf="ref.modal.showCloseButton"
          type="button"
          (click)="ref.close()"
          aria-label="Close"
          class="-mr-2 -mt-2 ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="min-h-0 flex-1 overflow-y-auto">
        <ng-container [ngSwitch]="contentType">
          <p *ngSwitchCase="'string'" [class]="hasHeader ? 'px-6 pb-6 text-sm leading-relaxed text-muted-foreground' : 'p-6 text-sm leading-relaxed text-muted-foreground'">{{ content }}</p>

          <ng-container *ngSwitchCase="'template'">
            <ng-container *ngTemplateOutlet="asTemplate; context: ref.modal.context"></ng-container>
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
      display: contents; /* This makes the host "disappear" so the div targets the overlay pane directly */
    }
  `]
})
export class ModalComponent implements OnInit {
  contentType: 'template' | 'string' | 'component' = 'string';
  content: any;
  modalClasses = '';

  constructor(public ref: ModalRef) {}

  ngOnInit() {
    this.content = this.ref.modal.content;
    this.modalClasses = this.getModalSizeCss();
    this.determineContentType();
  }

  /** Whether the auto-rendered header (title and/or close button) is shown. */
  get hasHeader(): boolean {
    return !!(this.ref.modal.showCloseButton || this.ref.modal.title);
  }

  private getModalSizeCss(): string {
    const { size } = this.ref.modal;

    return cn(
      // Surface: overlay card that never exceeds the viewport (header stays, body scrolls).
      'bg-background text-foreground border border-border shadow-lg relative flex flex-col w-full mx-auto',

      size === 'fullscreen' ? 'h-screen w-screen rounded-none' : 'rounded-lg max-h-[85vh]',

      // Sizing scale with explicit max-widths
      size === 'xs' && 'max-w-[320px]',
      size === 'sm' && 'max-w-[425px]',
      size === 'default' && 'max-w-[512px]',
      size === 'lg' && 'max-w-[1024px]',
      size === 'xl' && 'max-w-[1280px]'
    );
  }

  private determineContentType() {
    if (typeof this.content === 'string') this.contentType = 'string';
    else if (this.content instanceof TemplateRef) this.contentType = 'template';
    else this.contentType = 'component';
  }

  get asTemplate() { return this.content as TemplateRef<any>; }
  get asComponent() { return this.content as Type<any>; }
  protected cn = cn;
}
