
import { CommonModule } from '@angular/common';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'tolle-popover',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-block" #trigger (click)="toggle()">
      <ng-content select="[trigger]"></ng-content>
    </div>

    <div
      *ngIf="isOpen"
      #popover
      class="absolute top-0 left-0 w-max z-[9999]"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class PopoverComponent implements OnDestroy {
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Output() onOpen = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  @ViewChild('trigger') triggerEl!: ElementRef;
  @ViewChild('popover') popoverEl!: ElementRef;

  isOpen = false;
  private cleanup?: () => void;

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.onOpen.emit();
    setTimeout(() => this.updatePosition());
  }

  close() {
    this.isOpen = false;
    this.onClose.emit();
    if (this.cleanup) this.cleanup();
  }

  private updatePosition() {
    if (!this.triggerEl || !this.popoverEl) return;

    this.cleanup = autoUpdate(
      this.triggerEl.nativeElement,
      this.popoverEl.nativeElement,
      () => {
        computePosition(this.triggerEl.nativeElement, this.popoverEl.nativeElement, {
          placement: this.placement,
          middleware: [offset(8), flip(), shift({ padding: 8 })],
        }).then(({ x, y }) => {
          Object.assign(this.popoverEl.nativeElement.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      }
    );
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      this.isOpen &&
      !this.triggerEl.nativeElement.contains(event.target) &&
      !this.popoverEl?.nativeElement.contains(event.target)
    ) {
      this.close();
    }
  }

  ngOnDestroy() {
    if (this.cleanup) this.cleanup();
  }
}
