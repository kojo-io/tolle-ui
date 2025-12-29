import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizablePanelGroupComponent } from './resizable-panel-group.component';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-resizable-handle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      (mousedown)="onMouseDown($event)"
      [class]="cn(
        'relative flex items-center justify-center bg-border transition-all hover:bg-primary z-10',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-4 after:-translate-x-1/2',
        group.direction === 'horizontal' ? 'w-px h-full cursor-col-resize' : 'h-px w-full cursor-row-resize',
        class
      )"
    >
      <div *ngIf="withHandle" class="z-20 flex h-4 w-3 items-center justify-center rounded-sm border bg-border shadow-sm">
        <i class="ri-more-2-fill text-[10px]" [class.rotate-90]="group.direction === 'horizontal'"></i>
      </div>
    </div>
  `
})
export class ResizableHandleComponent {
  @Input() index = 0;
  @Input() withHandle = false;
  @Input() class = '';

  constructor(protected group: ResizablePanelGroupComponent) {}

  onMouseDown(event: MouseEvent) {
    // 1. Stop text selection and bubbling
    event.preventDefault();
    event.stopPropagation();

    // 2. Initialize the drag index
    this.group.startResizing(this.index);

    // 3. IMPORTANT: Manually trigger the group's mousedown to capture Initial Mouse Position
    // Without this, the delta calculation is wrong and the panel jumps.
    this.group.onMouseDown(event);
  }

  protected cn = cn;
}
