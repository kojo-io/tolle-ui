import {
  Directive, ElementRef, HostListener, Input,
  OnDestroy, ComponentRef, ViewContainerRef
} from '@angular/core';
import { computePosition, flip, shift, offset, arrow, autoUpdate } from '@floating-ui/dom';
import { cn } from './utils/cn';

let tooltipIdCounter = 0;

@Directive({
  selector: '[tolleTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  @Input('tolleTooltip') content: string = '';
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';

  private tooltipEl: HTMLDivElement | null = null;
  private cleanup?: () => void;
  private showTimeout?: any;
  private readonly tooltipId = `tolle-tooltip-${tooltipIdCounter++}`;

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  show() {
    if (!this.content) return;
    if (this.showTimeout || this.tooltipEl) return;

    // Delay showing the tooltip (~600ms) to avoid flicker on quick pointer passes.
    this.showTimeout = setTimeout(() => {
      this.showTimeout = undefined;

      // 1. Create Tooltip Element
      this.tooltipEl = document.createElement('div');
      this.tooltipEl.setAttribute('role', 'tooltip');
      this.tooltipEl.id = this.tooltipId;
      this.tooltipEl.className = cn(
        'absolute z-[100] px-2 py-1 text-xs font-medium bg-popover text-popover-foreground border border-border rounded-md shadow-md pointer-events-none'
      );
      this.tooltipEl.innerText = this.content;
      document.body.appendChild(this.tooltipEl);

      // Associate the tooltip with its host for assistive technology.
      this.el.nativeElement.setAttribute('aria-describedby', this.tooltipId);

      // 2. Position it using Floating UI
      this.cleanup = autoUpdate(this.el.nativeElement, this.tooltipEl, () => {
        computePosition(this.el.nativeElement, this.tooltipEl!, {
          placement: this.placement,
          middleware: [offset(8), flip(), shift({ padding: 5 })],
        }).then(({ x, y }) => {
          Object.assign(this.tooltipEl!.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      });
    }, 600);
  }

  @HostListener('focusin')
  onFocus() {
    this.show();
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  hide() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
    if (this.cleanup) {
      this.cleanup();
    }
    this.el.nativeElement.removeAttribute('aria-describedby');
  }

  ngOnDestroy() {
    this.hide();
  }
}
