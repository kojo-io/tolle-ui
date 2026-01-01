import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResizablePanelComponent} from './resizable-panel.component';
import {cn} from './utils/cn';

@Component({
  selector: 'tolle-resizable-panel-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="computedContainerClass"
      [style.flex]="size"
    >
      <ng-content></ng-content>

      <div
        *ngIf="resizable && !isLast"
        [class]="computedHandleClass"
        (mousedown)="onHandleMouseDown($event)"
      >
        <div class="absolute inset-0 flex items-center justify-center">
          <div [class]="computedHandleIndicatorClass"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }
  `]
})
export class ResizablePanelItemComponent {
  @Input() size: number = 1;
  @Input() minSize: number = 10; // percentage or pixels
  @Input() maxSize?: number;
  @Input() resizable: boolean = true;
  @Input() class: string = '';

  isLast: boolean = false;
  private container?: ResizablePanelComponent;

  get computedContainerClass() {
    return cn(
      'relative flex-1 overflow-hidden',
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
    // Handle resize logic here
    event.preventDefault();
    event.stopPropagation();
  }
}
