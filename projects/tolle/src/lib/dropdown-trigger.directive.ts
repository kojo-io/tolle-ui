import { Directive, input, ElementRef, OnDestroy, HostListener, ViewContainerRef, signal, inject } from '@angular/core';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { DropdownMenuComponent } from './dropdown-menu.component';

@Directive({
  selector: '[tolleDropdownTrigger]',
  standalone: true
})
export class DropdownTriggerDirective implements OnDestroy {
  menu = input.required<DropdownMenuComponent>({ alias: 'tolleDropdownTrigger' });

  private el = inject(ElementRef);
  private vcr = inject(ViewContainerRef);

  private cleanup?: () => void;
  private isOpen = signal(false);
  private menuElement?: HTMLElement;

  @HostListener('click')
  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  private open() {
    const template = this.menu().templateRef;
    if (!template) return;

    this.isOpen.set(true);

    // Create the menu view
    const view = this.vcr.createEmbeddedView(template);
    this.menuElement = view.rootNodes[0] as HTMLElement;
    document.body.appendChild(this.menuElement);

    // Floating UI positioning logic
    this.cleanup = autoUpdate(this.el.nativeElement, this.menuElement, () => {
      if (!this.menuElement) return;

      computePosition(this.el.nativeElement, this.menuElement, {
        placement: 'bottom-end',
        middleware: [
          offset(4),
          flip(),
          shift({ padding: 8 })
        ]
      }).then(({ x, y }) => {
        if (this.menuElement) {
          Object.assign(this.menuElement.style, {
            left: `${x}px`,
            top: `${y}px`,
            position: 'absolute'
          });
        }
      });
    });

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', this.outsideClick);
    });
  }

  private close() {
    this.isOpen.set(false);
    this.cleanup?.();
    this.menuElement?.remove();
    this.menuElement = undefined;
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
