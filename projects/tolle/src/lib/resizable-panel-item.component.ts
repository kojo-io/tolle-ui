import { Component, input, computed, inject, HostBinding, model, signal } from '@angular/core';

import { ResizablePanelComponent } from './resizable-panel.component';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-resizable-panel-item',
  standalone: true,
  imports: [],
  template: `
    <div [class]="computedContainerClass()">
      <ng-content></ng-content>
    </div>
    
    @if (resizable() && !isLast()) {
      <div
        [class]="computedHandleClass()"
        (mousedown)="onHandleMouseDown($event)"
        >
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div [class]="computedHandleIndicatorClass()"></div>
        </div>
      </div>
    }
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
  size = model<number>(1);
  minSize = input<number>(10);
  maxSize = input<number>();
  resizable = input(true);
  class = input('');

  isLast = signal(false);
  private container = inject(ResizablePanelComponent);

  @HostBinding('style.flex')
  get flexStyle() {
    return this.size();
  }

  computedContainerClass = computed(() => {
    return cn(
      'relative h-full w-full overflow-hidden',
      this.class()
    );
  });

  computedHandleClass = computed(() => {
    const isHorizontal = this.container?.direction() === 'horizontal';
    return cn(
      'absolute z-20',
      isHorizontal
        ? 'top-0 bottom-0 -right-2 w-4 cursor-col-resize'
        : 'left-0 right-0 -bottom-2 h-4 cursor-row-resize',
      'hover:bg-primary/5 active:bg-primary/10'
    );
  });

  computedHandleIndicatorClass = computed(() => {
    const isHorizontal = this.container?.direction() === 'horizontal';
    return cn(
      'bg-muted-foreground/40 rounded-full',
      isHorizontal ? 'w-1 h-6' : 'h-1 w-6'
    );
  });

  onHandleMouseDown(event: MouseEvent) {
    this.container.startResize(this, event);
  }
}
