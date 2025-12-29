import { Component, Input, ElementRef, ContentChildren, QueryList, AfterContentInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizablePanelComponent } from './resizable-panel.component';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-resizable-panel-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cn('flex h-full w-full', direction === 'vertical' ? 'flex-col' : 'flex-row', class)">
      <ng-content></ng-content>
    </div>
  `
})
export class ResizablePanelGroupComponent implements AfterContentInit {
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Input() class = '';

  @ContentChildren(ResizablePanelComponent) panels!: QueryList<ResizablePanelComponent>;

  private isDragging = false;
  private currentHandleIndex = -1;

  // Store the initial state when drag starts
  private initialMousePos = 0;
  private initialSizePrev = 0;
  private initialSizeNext = 0;

  // Store sizes for toggle functionality
  private lastSizes: number[] = [];

  constructor(private el: ElementRef) {}

  ngAfterContentInit() {
    const defaultSize = 100 / this.panels.length;
    this.panels.forEach(p => {
      if (!p.size) p.size = defaultSize;
    });
  }

  startResizing(index: number) {
    this.isDragging = true;
    this.currentHandleIndex = index;

    // 1. Capture the Initial State
    const panelsArray = this.panels.toArray();
    this.initialSizePrev = panelsArray[index].size;
    this.initialSizeNext = panelsArray[index + 1].size;

    // 2. Disable transitions globally while dragging
    this.panels.forEach(p => p.isDragging = true);

    // 3. Set cursor style
    document.body.style.cursor = this.direction === 'horizontal' ? 'col-resize' : 'row-resize';
  }

  // We capture the START position here to ensure we have the correct reference
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if(this.isDragging) {
      this.initialMousePos = this.direction === 'horizontal' ? event.clientX : event.clientY;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging || this.currentHandleIndex === -1) return;

    const panelsArray = this.panels.toArray();
    const prevPanel = panelsArray[this.currentHandleIndex];
    const nextPanel = panelsArray[this.currentHandleIndex + 1];

    if (!prevPanel || !nextPanel) return;

    // 1. Calculate how far the mouse has moved (in pixels)
    const currentMousePos = this.direction === 'horizontal' ? event.clientX : event.clientY;
    const deltaPixels = currentMousePos - this.initialMousePos;

    // 2. Convert that pixel delta into a Percentage relative to the container
    const containerRect = this.el.nativeElement.getBoundingClientRect();
    const containerSize = this.direction === 'horizontal' ? containerRect.width : containerRect.height;
    const deltaPercentage = (deltaPixels / containerSize) * 100;

    // 3. Calculate Target Sizes based on the INITIAL stable sizes + delta
    const totalSize = this.initialSizePrev + this.initialSizeNext;

    let newPrevSize = this.initialSizePrev + deltaPercentage;
    let newNextSize = this.initialSizeNext - deltaPercentage;

    // 4. Safety Clamps: Ensure we don't drag past 0 or total size
    // Note: We intentionally allow it to go slightly below minSize here
    // so that the Panel's internal "Snap" logic can trigger.
    if (newPrevSize < 0) newPrevSize = 0;
    if (newNextSize < 0) newNextSize = 0;

    // Prevent dragging next panel below 0
    if (newPrevSize > totalSize) newPrevSize = totalSize;

    // 5. Apply the updates
    prevPanel.updateSize(newPrevSize);

    // The next panel takes whatever is left of the shared space
    const actualPrevSize = prevPanel.isCollapsed ? prevPanel.collapsedSize : prevPanel.size;
    nextPanel.updateSize(totalSize - actualPrevSize);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
    this.panels.forEach(p => p.isDragging = false);
    document.body.style.cursor = '';
  }

  // ... togglePanel and handleKeyboardEvent methods remain the same ...
  togglePanel(index: number) {
    const panelsArray = this.panels.toArray();
    const panel = panelsArray[index];
    const sibling = panelsArray[index + 1];

    if (!panel || !sibling) return;

    if (panel.isCollapsed) {
      const restoreSize = this.lastSizes[index] || panel.minSize || 20;
      panel.updateSize(restoreSize);
      sibling.updateSize(sibling.size - (restoreSize - panel.collapsedSize));
    } else {
      this.lastSizes[index] = panel.size;
      const spaceToGive = panel.size - panel.collapsedSize;
      panel.updateSize(0);
      sibling.updateSize(sibling.size + spaceToGive);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      this.togglePanel(0);
    }
  }

  protected cn = cn;
}
