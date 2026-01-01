import { Component, Input, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';
import {ResizablePanelItemComponent} from './resizable-panel-item.component';

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
export class ResizablePanelComponent implements AfterContentInit {
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Input() class: string = '';

  @ContentChildren(ResizablePanelItemComponent) panels!: QueryList<ResizablePanelItemComponent>;

  ngAfterContentInit() {
    // Initialize panel sizes if needed
    setTimeout(() => this.updatePanelSizes());
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
