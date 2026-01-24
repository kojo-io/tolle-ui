import { Component, Input, ContentChildren, QueryList, AfterContentInit, ElementRef, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';
import { ResizablePanelItemComponent } from './resizable-panel-item.component';

@Component({
  selector: 'tolle-resizable-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedContainerClass">
      <div class="flex" [class.flex-col]="direction === 'vertical'" [class.flex-row]="direction === 'horizontal'">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ResizablePanelComponent implements AfterContentInit, OnDestroy {
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Input() class: string = '';

  @ContentChildren(ResizablePanelItemComponent) panels!: QueryList<ResizablePanelItemComponent>;

  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  private isResizing = false;
  private activePanelIndex = -1;
  private startCursorPosition = 0;
  private startPanelSizes: number[] = [];

  private mouseMoveListener?: (e: MouseEvent) => void;
  private mouseUpListener?: (e: MouseEvent) => void;

  ngAfterContentInit() {
    // Initialize panel sizes if needed
    setTimeout(() => {
      this.updatePanelSizes();
      this.updateLastStatus();
    });

    this.panels.changes.subscribe(() => {
      this.updatePanelSizes();
      this.updateLastStatus();
    });
  }

  ngOnDestroy() {
    this.cleanupListeners();
  }

  private updateLastStatus() {
    const panels = this.panels.toArray();
    panels.forEach((p, i) => p.isLast = i === panels.length - 1);
  }

  startResize(item: ResizablePanelItemComponent, event: MouseEvent) {
    const panels = this.panels.toArray();
    this.activePanelIndex = panels.indexOf(item);
    if (this.activePanelIndex === -1 || this.activePanelIndex === panels.length - 1) return;

    this.isResizing = true;
    this.startCursorPosition = this.direction === 'horizontal' ? event.clientX : event.clientY;
    this.startPanelSizes = panels.map(p => p.size);

    this.setupListeners();
    document.body.style.cursor = this.direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }

  private setupListeners() {
    this.mouseMoveListener = (e: MouseEvent) => this.onMouseMove(e);
    this.mouseUpListener = () => this.stopResize();

    document.addEventListener('mousemove', this.mouseMoveListener);
    document.addEventListener('mouseup', this.mouseUpListener);
  }

  private cleanupListeners() {
    if (this.mouseMoveListener) document.removeEventListener('mousemove', this.mouseMoveListener);
    if (this.mouseUpListener) document.removeEventListener('mouseup', this.mouseUpListener);
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;

    const currentPos = this.direction === 'horizontal' ? event.clientX : event.clientY;
    const deltaPx = currentPos - this.startCursorPosition;

    const containerSize = this.direction === 'horizontal'
      ? this.el.nativeElement.offsetWidth
      : this.el.nativeElement.offsetHeight;

    const deltaPercent = (deltaPx / containerSize) * 100;

    const panels = this.panels.toArray();
    const panelA = panels[this.activePanelIndex];
    const panelB = panels[this.activePanelIndex + 1];

    const newSizeA = Math.max(panelA.minSize, this.startPanelSizes[this.activePanelIndex] + deltaPercent);
    const actualDelta = newSizeA - this.startPanelSizes[this.activePanelIndex];
    const newSizeB = Math.max(panelB.minSize, this.startPanelSizes[this.activePanelIndex + 1] - actualDelta);

    panelA.size = newSizeA;
    panelB.size = this.startPanelSizes[this.activePanelIndex] + this.startPanelSizes[this.activePanelIndex + 1] - panelA.size;

    if (panelB.size < panelB.minSize) {
      panelB.size = panelB.minSize;
      panelA.size = (this.startPanelSizes[this.activePanelIndex] + this.startPanelSizes[this.activePanelIndex + 1]) - panelB.minSize;
    }

    this.cdr.detectChanges();
  }

  private stopResize() {
    this.isResizing = false;
    this.cleanupListeners();
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  private updatePanelSizes() {
    const panels = this.panels.toArray();
    const totalPanels = panels.length;

    if (totalPanels > 0) {
      const defaultSize = 100 / totalPanels;
      panels.forEach(panel => {
        if (!panel.size) {
          panel.size = defaultSize;
        }
      });
    }
  }

  get computedContainerClass() {
    return cn(
      'w-full h-full',
      this.class
    );
  }
}
