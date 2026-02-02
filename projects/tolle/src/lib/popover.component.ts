

import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { Component, ElementRef, HostListener, input, OnDestroy, output, viewChild, signal } from '@angular/core';

@Component({
  selector: 'tolle-popover',
  standalone: true,
  imports: [],
  template: `
    <div class="inline-block" #trigger (click)="toggle()">
      <ng-content select="[trigger]"></ng-content>
    </div>
    
    @if (isOpen()) {
      <div
        #popover
        class="absolute top-0 left-0 w-max z-[9999]"
        >
        <ng-content></ng-content>
      </div>
    }
    `
})
export class PopoverComponent implements OnDestroy {
  placement = input<'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end'>('bottom');
  onOpen = output<void>();
  onClose = output<void>();

  triggerEl = viewChild<ElementRef>('trigger');
  popoverEl = viewChild<ElementRef>('popover');

  isOpen = signal(false);
  private cleanup?: () => void;

  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    this.isOpen.set(true);
    this.onOpen.emit();
    setTimeout(() => this.updatePosition());
  }

  close() {
    this.isOpen.set(false);
    this.onClose.emit();
    if (this.cleanup) this.cleanup();
  }

  private updatePosition() {
    const trigger = this.triggerEl();
    const popover = this.popoverEl();
    if (!trigger || !popover) return;

    this.cleanup = autoUpdate(
      trigger.nativeElement,
      popover.nativeElement,
      () => {
        computePosition(trigger.nativeElement, popover.nativeElement, {
          placement: this.placement(),
          middleware: [offset(8), flip(), shift({ padding: 8 })],
        }).then(({ x, y }) => {
          Object.assign(popover.nativeElement.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      }
    );
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent) {
    const trigger = this.triggerEl();
    const popover = this.popoverEl();
    if (
      this.isOpen() &&
      trigger &&
      !trigger.nativeElement.contains(event.target) &&
      (!popover || !popover.nativeElement.contains(event.target))
    ) {
      this.close();
    }
  }

  ngOnDestroy() {
    if (this.cleanup) this.cleanup();
  }
}
