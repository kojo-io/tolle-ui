import { Component, input, output, ElementRef, viewChild, AfterViewInit, OnDestroy, signal, computed } from '@angular/core';

import { cn } from './utils/cn';

@Component({
  selector: 'tolle-resizable',
  standalone: true,
  imports: [],
  template: `
    <div
      #container
      [class]="computedContainerClass()"
      [style.width.px]="width()"
      [style.height.px]="height()"
      [style.minWidth.px]="minWidth()"
      [style.minHeight.px]="minHeight()"
      [style.maxWidth.px]="maxWidth()"
      [style.maxHeight.px]="maxHeight()"
      >
      <ng-content></ng-content>
    
      <!-- Resize handles -->
      @if (resizable()) {
        <div
          class="absolute -right-1 -bottom-1 w-3 h-3 cursor-se-resize z-10"
          (mousedown)="onResizeStart($event, 'both')"
          >
          <div class="absolute right-0 bottom-0 w-2 h-2 border-r-2 border-b-2 border-muted-foreground/50 rounded-sm"></div>
        </div>
      }
    
      @if (resizable() && directions().includes('right')) {
        <div
          class="absolute -right-1 top-0 bottom-0 w-2 cursor-col-resize z-10"
          (mousedown)="onResizeStart($event, 'horizontal')"
          >
          <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-muted-foreground/30"></div>
        </div>
      }
    
      @if (resizable() && directions().includes('bottom')) {
        <div
          class="absolute -bottom-1 left-0 right-0 h-2 cursor-row-resize z-10"
          (mousedown)="onResizeStart($event, 'vertical')"
          >
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-muted-foreground/30"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
      position: relative;
    }
  `]
})
export class ResizableComponent implements AfterViewInit, OnDestroy {
  _width = signal(300);
  _height = signal(200);

  width = input<number, number>(300, {
    transform: (v: number) => { this._width.set(v); return v; }
  });
  height = input<number, number>(200, {
    transform: (v: number) => { this._height.set(v); return v; }
  });

  // Actually, standard input() is better if we don't want to sync backwards to the input signal.
  // But the component modifies its own width/height during resize.
  // In Angular Signals, input() is read-only. We should use a private signal for internal state.

  minWidth = input<number>(50);
  minHeight = input<number>(50);
  maxWidth = input<number>();
  maxHeight = input<number>();
  resizable = input(true);
  directions = input<('right' | 'bottom' | 'both')[]>(['right', 'bottom', 'both']);
  class = input('');
  containerClass = input('');

  resizeStart = output<void>();
  resize = output<{ width: number; height: number }>();
  resizeEnd = output<{ width: number; height: number }>();

  container = viewChild<ElementRef<HTMLDivElement>>('container');

  isResizing = signal(false);
  private resizeDirection: 'horizontal' | 'vertical' | 'both' | null = null;
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;

  private mouseMoveListener?: (e: MouseEvent) => void;
  private mouseUpListener?: (e: MouseEvent) => void;

  ngAfterViewInit() {
    this.setupGlobalListeners();
  }

  ngOnDestroy() {
    this.cleanupGlobalListeners();
  }

  computedContainerClass = computed(() => {
    return cn(
      'relative bg-background border border-input rounded-md shadow-sm',
      'transition-[box-shadow] duration-200',
      this.resizable() && 'hover:shadow-md',
      this.isResizing() && 'shadow-lg ring-2 ring-ring/20',
      this.containerClass(),
      this.class()
    );
  });

  onResizeStart(event: MouseEvent, direction: 'horizontal' | 'vertical' | 'both') {
    if (!this.resizable()) return;

    event.preventDefault();
    event.stopPropagation();

    this.isResizing.set(true);
    this.resizeDirection = direction;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this._width.set(this.width());
    this._height.set(this.height());
    this.startWidth = this._width();
    this.startHeight = this._height();

    this.resizeStart.emit();

    document.body.style.userSelect = 'none';
    document.body.style.cursor = this.getResizeCursor(direction);
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isResizing() || !this.resizeDirection) return;

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    let newWidth = this.startWidth;
    let newHeight = this.startHeight;

    if (this.resizeDirection === 'horizontal' || this.resizeDirection === 'both') {
      newWidth = Math.max(this.minWidth(), this.startWidth + deltaX);
      const maxW = this.maxWidth();
      if (maxW) newWidth = Math.min(maxW, newWidth);
    }

    if (this.resizeDirection === 'vertical' || this.resizeDirection === 'both') {
      newHeight = Math.max(this.minHeight(), this.startHeight + deltaY);
      const maxH = this.maxHeight();
      if (maxH) newHeight = Math.min(maxH, newHeight);
    }

    this._width.set(newWidth);
    this._height.set(newHeight);

    this.resize.emit({ width: newWidth, height: newHeight });
  }

  private onMouseUp() {
    if (!this.isResizing()) return;

    this.isResizing.set(false);
    this.resizeDirection = null;

    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    this.resizeEnd.emit({ width: this._width(), height: this._height() });
  }

  private getResizeCursor(direction: 'horizontal' | 'vertical' | 'both'): string {
    switch (direction) {
      case 'horizontal': return 'col-resize';
      case 'vertical': return 'row-resize';
      case 'both': return 'se-resize';
      default: return '';
    }
  }

  private setupGlobalListeners() {
    this.mouseMoveListener = (e: MouseEvent) => this.onMouseMove(e);
    this.mouseUpListener = () => this.onMouseUp();

    document.addEventListener('mousemove', this.mouseMoveListener);
    document.addEventListener('mouseup', this.mouseUpListener);
  }

  private cleanupGlobalListeners() {
    if (this.mouseMoveListener) {
      document.removeEventListener('mousemove', this.mouseMoveListener);
    }
    if (this.mouseUpListener) {
      document.removeEventListener('mouseup', this.mouseUpListener);
    }
  }
}
