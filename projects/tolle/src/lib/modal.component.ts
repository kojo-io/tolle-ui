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

      <div class="flex items-center justify-between p-6 border-b border-border">
        <h3 *ngIf="ref.modal.title" class="text-lg font-semibold text-foreground tracking-tight">
          {{ ref.modal.title }}
        </h3>
        <button (click)="ref.close()" class="ml-auto p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
          <i class="ri-close-line text-2xl"></i>
        </button>
      </div>

      <div class="p-6 overflow-y-auto max-h-[80vh] text-foreground">
        <ng-container [ngSwitch]="contentType">
          <div *ngSwitchCase="'string'">{{ content }}</div>

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

  private getModalSizeCss(): string {
    const { size } = this.ref.modal;

    return cn(
      // Base classes: Added 'w-full' and 'mx-auto'
      'bg-background border border-border shadow-lg relative flex flex-col w-full mx-auto overflow-hidden',

      size === 'fullscreen' ? 'h-screen w-screen rounded-none' : 'rounded-lg',

      // Sizing scale with explicit max-widths
      size === 'xs' && 'max-w-[320px]',
      size === 'sm' && 'max-w-[425px]',
      size === 'default' && 'max-w-[544px]',
      size === 'lg' && 'max-w-[1024px]'
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
