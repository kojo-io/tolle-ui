import {
  Directive, ElementRef, HostListener, input,
  OnDestroy
} from '@angular/core';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { cn } from './utils/cn';

@Directive({
  selector: '[tolleTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  content = input('', { alias: 'tolleTooltip' });
  placement = input<'top' | 'bottom' | 'left' | 'right'>('top');

  private tooltipEl: HTMLDivElement | null = null;
  private cleanup?: () => void;

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter')
  show() {
    if (!this.content()) return;

    // 1. Create Tooltip Element
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = cn(
      'absolute z-[100] px-2 py-1 text-xs font-medium text-white bg-black rounded shadow-md pointer-events-none'
    );
    this.tooltipEl.innerText = this.content();
    document.body.appendChild(this.tooltipEl);

    // 2. Position it using Floating UI
    this.cleanup = autoUpdate(this.el.nativeElement, this.tooltipEl, () => {
      computePosition(this.el.nativeElement, this.tooltipEl!, {
        placement: this.placement(),
        middleware: [offset(8), flip(), shift({ padding: 5 })],
      }).then(({ x, y }) => {
        Object.assign(this.tooltipEl!.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  hide() {
    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = undefined;
    }
  }

  ngOnDestroy() {
    this.hide();
  }
}
