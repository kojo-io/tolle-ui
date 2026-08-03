import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-resizable',
    imports: [CommonModule],
    template: `
    <div
      #container
      [class]="computedContainerClass"
      [style.width.px]="width"
      [style.height.px]="height"
      [style.minWidth.px]="minWidth"
      [style.minHeight.px]="minHeight"
      [style.maxWidth.px]="maxWidth"
      [style.maxHeight.px]="maxHeight"
    >
      <ng-content></ng-content>

      <!-- Resize handles -->
      <div
        *ngIf="resizable"
        class="absolute -right-1 -bottom-1 w-3 h-3 cursor-se-resize z-10"
        (mousedown)="onResizeStart($event, 'both')"
      >
        <div class="absolute right-0 bottom-0 w-2 h-2 border-r-2 border-b-2 border-muted-foreground/50 rounded-sm"></div>
      </div>

      <div
        *ngIf="resizable && directions.includes('right')"
        class="absolute -right-1 top-0 bottom-0 w-2 cursor-col-resize z-10"
        (mousedown)="onResizeStart($event, 'horizontal')"
      >
        <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-muted-foreground/30"></div>
      </div>

      <div
        *ngIf="resizable && directions.includes('bottom')"
        class="absolute -bottom-1 left-0 right-0 h-2 cursor-row-resize z-10"
        (mousedown)="onResizeStart($event, 'vertical')"
      >
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-muted-foreground/30"></div>
      </div>
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
  @Input() width: number = 300;
  @Input() height: number = 200;
  @Input() minWidth: number = 50;
  @Input() minHeight: number = 50;
  @Input() maxWidth?: number;
  @Input() maxHeight?: number;
  @Input() resizable: boolean = true;
  @Input() directions: ('right' | 'bottom' | 'both')[] = ['right', 'bottom', 'both'];
  @Input() class: string = '';
  @Input() containerClass: string = '';

  @Output() resizeStart = new EventEmitter<void>();
  @Output() resize = new EventEmitter<{ width: number; height: number }>();
  @Output() resizeEnd = new EventEmitter<{ width: number; height: number }>();

  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  private isResizing = false;
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

  get computedContainerClass() {
    return cn(
      'relative bg-background border border-input rounded-md shadow-sm',
      'transition-[box-shadow] duration-200',
      this.resizable && 'hover:shadow-md',
      this.isResizing && 'shadow-lg ring-2 ring-ring/20',
      this.containerClass,
      this.class
    );
  }

  onResizeStart(event: MouseEvent, direction: 'horizontal' | 'vertical' | 'both') {
    if (!this.resizable) return;

    event.preventDefault();
    event.stopPropagation();

    this.isResizing = true;
    this.resizeDirection = direction;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.width;
    this.startHeight = this.height;

    this.resizeStart.emit();

    // Add active styling
    document.body.style.userSelect = 'none';
    document.body.style.cursor = this.getResizeCursor(direction);
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isResizing || !this.resizeDirection) return;

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    let newWidth = this.startWidth;
    let newHeight = this.startHeight;

    if (this.resizeDirection === 'horizontal' || this.resizeDirection === 'both') {
      newWidth = Math.max(this.minWidth, this.startWidth + deltaX);
      if (this.maxWidth) newWidth = Math.min(this.maxWidth, newWidth);
    }

    if (this.resizeDirection === 'vertical' || this.resizeDirection === 'both') {
      newHeight = Math.max(this.minHeight, this.startHeight + deltaY);
      if (this.maxHeight) newHeight = Math.min(this.maxHeight, newHeight);
    }

    this.width = newWidth;
    this.height = newHeight;

    this.resize.emit({ width: newWidth, height: newHeight });
  }

  private onMouseUp() {
    if (!this.isResizing) return;

    this.isResizing = false;
    this.resizeDirection = null;

    // Reset cursor and selection
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    this.resizeEnd.emit({ width: this.width, height: this.height });
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
