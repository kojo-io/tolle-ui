import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, TemplateRef, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';
import { ModalRef } from './modal-ref';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-modal',
  standalone: true,
  imports: [CommonModule, A11yModule],
  template: `
    <div [class]="modalClasses" class="pointer-events-auto"
      [attr.data-state]="closing ? 'closed' : 'open'"
      role="dialog"
      aria-modal="true"
      [attr.aria-labelledby]="ref.modal.title ? titleId : null"
      [attr.aria-describedby]="contentType === 'string' ? descId : null"
      cdkTrapFocus cdkTrapFocusAutoCapture
      (mousedown)="$event.stopPropagation()">

      <button
        *ngIf="ref.modal.showCloseButton"
        type="button"
        (click)="ref.close()"
        aria-label="Close"
        class="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-sm text-muted-foreground opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <i class="ri-close-line text-base" aria-hidden="true"></i>
      </button>

      <!-- Header -->
      <div *ngIf="ref.modal.title" class="flex shrink-0 flex-col gap-1.5 pr-8 text-center sm:text-left">
        <h2 [id]="titleId" class="text-lg font-semibold leading-none tracking-tight text-foreground">
          {{ ref.modal.title }}
        </h2>
      </div>

      <!-- Body -->
      <div class="min-h-0 flex-1 overflow-y-auto">
        <ng-container [ngSwitch]="contentType">
          <p *ngSwitchCase="'string'" [id]="descId" class="text-sm leading-relaxed text-muted-foreground">{{ content }}</p>

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
export class ModalComponent implements OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscription = new Subscription();

  contentType: 'template' | 'string' | 'component' = 'string';
  content: any;
  modalClasses = '';
  /** True while the exit animation plays, just before the overlay is torn down. */
  closing = false;

  /** Stable, per-instance ids used to wire dialog ARIA relationships. */
  private readonly _uid = Math.random().toString(36).substr(2, 9);
  readonly titleId = `tolle-modal-title-${this._uid}`;
  readonly descId = `tolle-modal-desc-${this._uid}`;

  constructor(public ref: ModalRef) {}

  ngOnInit() {
    this.content = this.ref.modal.content;
    this.modalClasses = this.getModalSizeCss();
    this.determineContentType();

    this.subscription.add(
      this.ref.closing$.subscribe((closing) => {
        this.closing = closing;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getModalSizeCss(): string {
    const { size } = this.ref.modal;

    return cn(
      // Surface: overlay card that never exceeds the viewport (header stays, body scrolls).
      'relative flex w-full mx-auto flex-col gap-4 rounded-lg border border-border bg-background p-6 text-foreground shadow-lg duration-200',

      // Enter/exit animation, driven by `data-state` (see `closing` above).
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',

      size === 'fullscreen' ? 'h-screen w-screen rounded-none' : 'max-h-[85vh]',

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
