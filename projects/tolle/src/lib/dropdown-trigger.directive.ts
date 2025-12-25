import { Directive, Input, ElementRef, OnDestroy, HostListener, ViewContainerRef } from '@angular/core';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { DropdownMenuComponent } from './dropdown-menu.component';

@Directive({
  selector: '[tolleDropdownTrigger]',
  standalone: true
})
export class DropdownTriggerDirective implements OnDestroy {
  @Input('tolleDropdownTrigger') menu!: DropdownMenuComponent;

  private cleanup?: () => void;
  private isOpen = false;
  private menuElement?: HTMLElement;

  constructor(
    private el: ElementRef,
    private vcr: ViewContainerRef
  ) {}

  @HostListener('click')
  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  private open() {
    this.isOpen = true;

    // Create the menu view
    const view = this.vcr.createEmbeddedView(this.menu.templateRef);
    this.menuElement = view.rootNodes[0] as HTMLElement;
    document.body.appendChild(this.menuElement);

    // Floating UI positioning logic
    this.cleanup = autoUpdate(this.el.nativeElement, this.menuElement, () => {
      computePosition(this.el.nativeElement, this.menuElement!, {
        placement: 'bottom-end',
        middleware: [
          offset(4), // Space between trigger and menu
          flip(),   // Flip to top if space is tight
          shift({ padding: 8 }) // Prevent menu from hitting screen edges
        ]
      }).then(({ x, y }) => {
        Object.assign(this.menuElement!.style, {
          left: `${x}px`,
          top: `${y}px`,
          position: 'absolute'
        });
      });
    });

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', this.outsideClick);
    });
  }

  private close() {
    this.isOpen = false;
    this.cleanup?.();
    this.menuElement?.remove();
    document.removeEventListener('click', this.outsideClick);
  }

  private outsideClick = (event: MouseEvent) => {
    if (!this.el.nativeElement.contains(event.target) && !this.menuElement?.contains(event.target as Node)) {
      this.close();
    }
  };

  ngOnDestroy() {
    this.close();
  }
}
