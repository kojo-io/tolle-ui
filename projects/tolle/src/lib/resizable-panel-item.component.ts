import { Component, Input, inject, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizablePanelComponent } from './resizable-panel.component';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-resizable-panel-item',
    imports: [CommonModule],
    template: `
    <div [class]="computedContainerClass">
      <ng-content></ng-content>
    </div>

    <div
      *ngIf="resizable && !isLast"
      [class]="computedHandleClass"
      (mousedown)="onHandleMouseDown($event)"
    >
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div [class]="computedHandleIndicatorClass"></div>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      position: relative;
      overflow: visible;
    }
  `]
})
export class ResizablePanelItemComponent {
  @Input() @HostBinding('style.flex') size: number = 1;
  @Input() minSize: number = 10; // percentage or pixels
  @Input() maxSize?: number;
  @Input() resizable: boolean = true;
  @Input() class: string = '';

  isLast: boolean = false;
  private container = inject(ResizablePanelComponent);

  get computedContainerClass() {
    return cn(
      'relative h-full w-full overflow-hidden',
      this.class
    );
  }

  get computedHandleClass() {
    const isHorizontal = this.container?.direction === 'horizontal';
    return cn(
      'absolute z-20',
      isHorizontal
        ? 'top-0 bottom-0 -right-2 w-4 cursor-col-resize'
        : 'left-0 right-0 -bottom-2 h-4 cursor-row-resize',
      'hover:bg-primary/5 active:bg-primary/10'
    );
  }

  get computedHandleIndicatorClass() {
    const isHorizontal = this.container?.direction === 'horizontal';
    return cn(
      'bg-muted-foreground/40 rounded-full',
      isHorizontal ? 'w-1 h-6' : 'h-1 w-6'
    );
  }

  onHandleMouseDown(event: MouseEvent) {
    this.container.startResize(this, event);
  }
}
