import { Component, OnInit, TemplateRef, Type, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef } from './modal-ref';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedModalClasses()" class="pointer-events-auto" (mousedown)="$event.stopPropagation()">
    
      @if (ref.modal.showCloseButton || ref.modal.title) {
        <div class="flex items-center justify-between px-6 pt-6">
          @if (ref.modal.title) {
            <h3 class="text-lg font-semibold text-foreground tracking-tight">
              {{ ref.modal.title }}
            </h3>
          }
          @if (ref.modal.showCloseButton) {
            <button (click)="ref.close()" class="ml-auto p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
              <i class="ri-close-line text-2xl"></i>
            </button>
          }
        </div>
      }
    
      <div class="px-6 pb-6 pt-4 overflow-y-auto max-h-[80vh] text-foreground">
        @switch (contentType()) {
          @case ('string') {
            <div>{{ content() }}</div>
          }
          @case ('template') {
            <ng-container *ngTemplateOutlet="asTemplate(); context: ref.modal.context"></ng-container>
          }
          @case ('component') {
            <ng-container *ngComponentOutlet="asComponent()"></ng-container>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class ModalComponent implements OnInit {
  public ref = inject(ModalRef);

  contentType = signal<'template' | 'string' | 'component'>('string');
  content = signal<any>(null);

  constructor() { }

  ngOnInit() {
    const val = this.ref.modal.content;
    this.content.set(val);
    this.determineContentType(val);
  }

  computedModalClasses = computed(() => {
    const { size } = this.ref.modal;

    return cn(
      'bg-background border border-border shadow-lg relative flex flex-col w-full mx-auto ',
      size === 'fullscreen' ? 'h-screen w-screen rounded-none' : 'rounded-md',
      size === 'xs' && 'max-w-[320px]',
      size === 'sm' && 'max-w-[425px]',
      size === 'default' && 'max-w-[544px]',
      size === 'lg' && 'max-w-[1024px]'
    );
  });

  private determineContentType(content: any) {
    if (typeof content === 'string') this.contentType.set('string');
    else if (content instanceof TemplateRef) this.contentType.set('template');
    else this.contentType.set('component');
  }

  asTemplate = computed(() => this.content() as TemplateRef<any>);
  asComponent = computed(() => this.content() as Type<any>);
  protected cn = cn;
}
