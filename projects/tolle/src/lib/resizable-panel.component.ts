import { Component, input, contentChildren, AfterContentInit, ElementRef, inject, ChangeDetectorRef, OnDestroy, signal, computed, effect } from '@angular/core';

import { cn } from './utils/cn';
import { ResizablePanelItemComponent } from './resizable-panel-item.component';

@Component({
  selector: 'tolle-resizable-panel',
  standalone: true,
  imports: [],
  template: `
    <div [class]="computedContainerClass()">
      <div class="flex" [class.flex-col]="direction() === 'vertical'" [class.flex-row]="direction() === 'horizontal'">
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
  direction = input<'horizontal' | 'vertical'>('horizontal');
  class = input('');

  panels = contentChildren(ResizablePanelItemComponent);

  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  private isResizing = signal(false);
  private activePanelIndex = -1;
  private startCursorPosition = 0;
  private startPanelSizes: number[] = [];

  private mouseMoveListener?: (e: MouseEvent) => void;
  private mouseUpListener?: (e: MouseEvent) => void;

  constructor() {
    effect(() => {
      const panels = this.panels();
      if (panels.length > 0) {
        this.updatePanelSizes();
        this.updateLastStatus();
      }
    });
  }

  ngAfterContentInit() {
    // Initial sync will be handled by effect
  }

  ngOnDestroy() {
    this.cleanupListeners();
  }

  private updateLastStatus() {
    const panels = this.panels();
    panels.forEach((p: ResizablePanelItemComponent, i: number) => p.isLast.set(i === panels.length - 1));
  }

  startResize(item: ResizablePanelItemComponent, event: MouseEvent) {
    const panels = this.panels();
    this.activePanelIndex = panels.indexOf(item);
    if (this.activePanelIndex === -1 || this.activePanelIndex === panels.length - 1) return;

    this.isResizing.set(true);
    this.startCursorPosition = this.direction() === 'horizontal' ? event.clientX : event.clientY;
    this.startPanelSizes = panels.map((p: ResizablePanelItemComponent) => p.size());

    this.setupListeners();
    document.body.style.cursor = this.direction() === 'horizontal' ? 'col-resize' : 'row-resize';
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
    if (!this.isResizing()) return;

    const currentPos = this.direction() === 'horizontal' ? event.clientX : event.clientY;
    const deltaPx = currentPos - this.startCursorPosition;

    const containerSize = this.direction() === 'horizontal'
      ? this.el.nativeElement.offsetWidth
      : this.el.nativeElement.offsetHeight;

    const deltaPercent = (deltaPx / containerSize) * 100;

    const panels = this.panels();
    const panelA = panels[this.activePanelIndex];
    const panelB = panels[this.activePanelIndex + 1];

    if (!panelA || !panelB) return;

    const newSizeA = Math.max(panelA.minSize(), this.startPanelSizes[this.activePanelIndex] + deltaPercent);
    const actualDelta = newSizeA - this.startPanelSizes[this.activePanelIndex];

    panelA.size.set(newSizeA);
    panelB.size.set(Math.max(panelB.minSize(), this.startPanelSizes[this.activePanelIndex] + this.startPanelSizes[this.activePanelIndex + 1] - newSizeA));

    if (panelB.size() < panelB.minSize()) {
      panelB.size.set(panelB.minSize());
      panelA.size.set((this.startPanelSizes[this.activePanelIndex] + this.startPanelSizes[this.activePanelIndex + 1]) - panelB.minSize());
    }

    this.cdr.detectChanges();
  }

  private stopResize() {
    this.isResizing.set(false);
    this.cleanupListeners();
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  private updatePanelSizes() {
    const panels = this.panels();
    const totalPanels = panels.length;

    if (totalPanels > 0) {
      const defaultSize = 100 / totalPanels;
      panels.forEach((panel: ResizablePanelItemComponent) => {
        if (!panel.size()) {
          panel.size.set(defaultSize);
        }
      });
    }
  }

  computedContainerClass = computed(() => {
    return cn(
      'w-full h-full',
      this.class()
    );
  });
}
