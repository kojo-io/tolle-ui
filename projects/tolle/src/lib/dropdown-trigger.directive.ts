import { Directive, Input, ElementRef, OnDestroy, HostListener, ViewContainerRef } from '@angular/core';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { DropdownMenuComponent } from './dropdown-menu.component';

/** Enabled items of an open menu, in DOM order. */
const ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"]):not([data-disabled])';

@Directive({
  selector: '[tolleDropdownTrigger]',
  standalone: true,
  host: {
    '[attr.aria-haspopup]': "'menu'",
    '[attr.aria-expanded]': 'isOpen',
  },
})
export class DropdownTriggerDirective implements OnDestroy {
  /** The `<tolle-dropdown-menu>` to open, as a template reference: `[tolleDropdownTrigger]="menu"`. */
  @Input('tolleDropdownTrigger') menu!: DropdownMenuComponent;

  private cleanup?: () => void;
  protected isOpen = false;
  private menuElement?: HTMLElement;

  constructor(
    private el: ElementRef,
    private vcr: ViewContainerRef
  ) {}

  @HostListener('click', ['$event'])
  toggle(event?: MouseEvent) {
    if (this.isOpen) {
      this.close();
      return;
    }
    this.open();
    // A keyboard-initiated click (Enter / Space) has detail 0: move focus into
    // the menu so arrow keys work, as a native menu button does.
    if (event && event.detail === 0) this.focusItem(0);
  }

  @HostListener('keydown', ['$event'])
  onTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isOpen) {
      event.preventDefault();
      this.close();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.isOpen) this.open();
      this.focusItem(event.key === 'ArrowDown' ? 0 : -1);
    }
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
          flip(), // Flip to top if space is tight
          shift({ padding: 8 }), // Prevent menu from hitting screen edges
        ],
      }).then(({ x, y }) => {
        Object.assign(this.menuElement!.style, {
          left: `${x}px`,
          top: `${y}px`,
          position: 'absolute',
        });
      });
    });

    // Choosing an item closes the menu. Bubble phase, so the item's own
    // (click) handler has already run.
    this.menuElement.addEventListener('click', this.onMenuClick);
    this.menuElement.addEventListener('keydown', this.onMenuKeydown);

    // Close on outside click. Capture phase so container components that call
    // stopPropagation() on their root (modal, sheet, country-selector) cannot
    // prevent the event from reaching us.
    setTimeout(() => {
      document.addEventListener('pointerdown', this.outsideClick, true);
    });
  }

  private close(restoreFocus = false) {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.cleanup?.();
    this.menuElement?.removeEventListener('click', this.onMenuClick);
    this.menuElement?.removeEventListener('keydown', this.onMenuKeydown);
    this.menuElement?.remove();
    this.menuElement = undefined;
    document.removeEventListener('pointerdown', this.outsideClick, true);
    if (restoreFocus) (this.el.nativeElement as HTMLElement).focus?.();
  }

  private items(): HTMLElement[] {
    return Array.from(this.menuElement?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);
  }

  /** Focus item `index`; negative counts from the end. */
  private focusItem(index: number) {
    const items = this.items();
    if (!items.length) return;
    items[(index + items.length) % items.length].focus();
  }

  private onMenuClick = (event: MouseEvent) => {
    const item = (event.target as Element | null)?.closest('[role="menuitem"]');
    if (!item || !this.menuElement?.contains(item)) return;
    if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('data-disabled')) return;
    // A keyboard activation should hand focus back to the trigger.
    this.close(event.detail === 0);
  };

  private onMenuKeydown = (event: KeyboardEvent) => {
    const items = this.items();
    const current = items.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusItem(current + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusItem(current < 0 ? -1 : current - 1);
        break;
      case 'Home':
        event.preventDefault();
        this.focusItem(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusItem(-1);
        break;
      case 'Enter':
      case ' ':
        if (current >= 0) {
          event.preventDefault();
          items[current].click();
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.close(true);
        break;
      case 'Tab':
        this.close();
        break;
    }
  };

  private outsideClick = (event: MouseEvent) => {
    if (!this.el.nativeElement.contains(event.target) && !this.menuElement?.contains(event.target as Node)) {
      this.close();
    }
  };

  ngOnDestroy() {
    this.close();
  }
}
