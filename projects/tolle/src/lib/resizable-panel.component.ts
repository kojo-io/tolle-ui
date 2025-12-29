import { Component, Input, Output, EventEmitter } from '@angular/core';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-resizable-panel',
  standalone: true,
  template: `
    <div
      [style.flex]="(isCollapsed ? collapsedSize : size) + ' 1 0px'"
      [class]="cn(
        'overflow-hidden',
        !isDragging ? 'transition-all duration-300 ease-in-out' : '',
        class
      )"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class ResizablePanelComponent {
  @Input() size = 0;
  @Input() minSize = 10;
  @Input() collapsible = false;
  @Input() collapsedSize = 0;
  @Input() class = '';
  @Input() isDragging = false;
  @Output() onCollapse = new EventEmitter<boolean>();

  isCollapsed = false;

  updateSize(newSize: number) {
    if (this.collapsible) {
      const collapseThreshold = this.minSize * 0.25;

      // 1. If we are currently visible and drag way below the threshold -> Collapse
      if (newSize < collapseThreshold && !this.isCollapsed) {
        this.isCollapsed = true;
        this.size = this.collapsedSize;
        this.onCollapse.emit(true);
        return;
      }

      // 2. If we are collapsed and drag past 50% of minSize -> Expand
      if (this.isCollapsed && newSize > this.minSize * 0.5) {
        this.isCollapsed = false;
        this.onCollapse.emit(false);
      }
    }

    // 3. Clamping: If not collapsed, force the size to be at least minSize
    // This prevents the panel from visually shrinking below minSize
    // until the snap threshold is actually hit.
    if (!this.isCollapsed) {
      this.size = Math.max(this.minSize, newSize);
    }
  }

  protected cn = cn;
}
