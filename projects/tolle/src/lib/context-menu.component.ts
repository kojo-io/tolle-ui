import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuItem, ContextMenuService, ContextMenuState } from './context-menu.service';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-context-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div
        #menu
        role="menu"
        aria-orientation="vertical"
        [attr.data-state]="isOpen ? 'open' : 'closed'"
        class="fixed z-50 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md
               data-[state=closed]:animate-out
               data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
               data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
               slide-in-from-top-2"
        [style.visibility]="isPositioned ? 'visible' : 'hidden'"
        [style.opacity]="isPositioned ? '1' : '0'"
        style="will-change: transform; top: 0; left: 0;"
        (keydown)="onKeyDown($event)"
      >
        <div class="flex flex-col">
          @for (item of items; track $index) {
            @if (item.separator) {
              <div role="separator" class="h-px -mx-1 my-1 bg-border"></div>
            } @else {
              <div class="relative group">
                <button
                  #itemButton
                  type="button"
                  role="menuitem"
                  [attr.aria-haspopup]="item.submenu ? 'true' : null"
                  [attr.aria-expanded]="openSubmenuId === item.id ? 'true' : null"
                  [attr.aria-disabled]="item.disabled ? 'true' : null"
                  (click)="onItemClick(item)"
                  (mouseenter)="onItemMouseEnter(item, itemButton)"
                  (mouseleave)="onItemMouseLeave()"
                  [disabled]="item.disabled"
                  [class]="cn(
                    'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                    'transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground',
                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    item.destructive ? 'text-destructive focus:bg-destructive/10 focus:text-destructive' : '',
                    item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                    (item.type === 'checkbox' || item.type === 'radio') ? 'pl-8' : '',
                    activeIndex === $index && 'bg-accent text-accent-foreground'
                  )"
                >
                  @if (item.checked) {
                    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <i [class]="item.type === 'radio' ? 'ri-checkbox-blank-circle-fill h-2 w-2 fill-current' : 'ri-check-line h-4 w-4'"></i>
                    </span>
                  }
                  @if (item.icon) {
                    <i [class]="cn(item.icon, 'mr-2 h-4 w-4')"></i>
                  }
                  <span class="flex-1 text-left">{{ item.label }}</span>
                  @if (item.shortcut && !item.submenu) {
                    <span class="ml-auto text-xs tracking-widest text-muted-foreground pl-2">{{ item.shortcut }}</span>
                  }
                  @if (item.submenu) {
                    <i class="ri-arrow-right-s-line ml-auto h-4 w-4 opacity-50"></i>
                  }
                </button>
              </div>
            }
          }
        </div>
      </div>

      @if (openSubmenuId && activeSubmenuItems.length > 0) {
        <div
          #submenu
          role="menu"
          [id]="'submenu-' + openSubmenuId"
          class="fixed z-50 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
          [style.visibility]="isSubmenuPositioned ? 'visible' : 'hidden'"
          [style.opacity]="isSubmenuPositioned ? '1' : '0'"
          style="will-change: transform"
          (mouseenter)="onSubmenuMouseEnter()"
          (mouseleave)="onSubmenuMouseLeave()"
        >
          @for (subItem of activeSubmenuItems; track $index) {
            @if (subItem.separator) {
              <div role="separator" class="h-px -mx-1 my-1 bg-border"></div>
            } @else {
              <button
                type="button"
                role="menuitem"
                (click)="onSubItemClick(subItem)"
                [disabled]="subItem.disabled"
                [class]="cn(
                  'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                  'transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  subItem.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                  (subItem.type === 'checkbox' || subItem.type === 'radio') ? 'pl-8' : '',
                  subItem.destructive ? 'text-destructive hover:bg-destructive/10' : ''
                )"
              >
                @if (subItem.checked) {
                  <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <i [class]="subItem.type === 'radio' ? 'ri-checkbox-blank-circle-fill h-2 w-2 fill-current' : 'ri-check-line h-4 w-4'"></i>
                  </span>
                }
                @if (subItem.icon) {
                  <i [class]="cn(subItem.icon, 'mr-2 h-4 w-4')"></i>
                }
                <span class="flex-1 text-left">{{ subItem.label }}</span>
                @if (subItem.shortcut) {
                  <span class="ml-auto text-xs tracking-widest text-muted-foreground pl-2">{{ subItem.shortcut }}</span>
                }
              </button>
            }
          }
        </div>
      }
    }
  `,
  styles: [`
    :host { display: contents; }
  `]
})
export class ContextMenuComponent implements OnInit, OnDestroy {
  private contextMenuService = inject(ContextMenuService);
  private elementRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('menu') menuElement!: ElementRef<HTMLDivElement>;

  // We only have one active submenu now, so we can use ViewChild instead of ViewChildren
  @ViewChild('submenu') submenuElement!: ElementRef<HTMLDivElement>;

  @ViewChildren('itemButton') itemButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  isOpen = false;
  isPositioned = false;
  isSubmenuPositioned = false;
  items: ContextMenuItem[] = [];

  openSubmenuId: string | null = null;
  activeSubmenuTrigger: HTMLElement | null = null; // Store the button that triggered the submenu

  activeIndex = -1;
  private stateSubscription: any;
  private submenuTimeout: any;

  protected readonly cn = cn;

  ngOnInit() {
    this.stateSubscription = this.contextMenuService.stateChanged.subscribe((state: ContextMenuState) => {
      this.isOpen = state.isOpen;
      this.items = state.items;

      if (state.isOpen) {
        this.activeIndex = -1;
        this.isPositioned = false;
        this.cdr.detectChanges();
        requestAnimationFrame(() => {
          this.positionMenu();
          this.focusFirstItem();
        });
      } else {
        this.closeSubmenu();
        this.activeIndex = -1;
        this.isPositioned = false;
      }
    });
  }

  // Helper to get items for the currently open submenu
  get activeSubmenuItems(): ContextMenuItem[] {
    if (!this.openSubmenuId) return [];
    return this.items.find(i => i.id === this.openSubmenuId)?.submenu || [];
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:contextmenu', ['$event'])
  onDocumentEvents(event: MouseEvent) {
    if (!this.isOpen) return;

    // Check if click is inside main menu OR the active submenu
    const clickedInsideMenu = this.menuElement?.nativeElement.contains(event.target as Node);
    const clickedInsideSubmenu = this.submenuElement?.nativeElement.contains(event.target as Node);

    if (clickedInsideMenu || clickedInsideSubmenu) {
      return;
    }

    this.contextMenuService.close();
  }

  async positionMenu() {
    if (this.menuElement?.nativeElement) {
      this.isPositioned = false;
      this.cdr.detectChanges();
      await this.contextMenuService.positionMenu(this.menuElement.nativeElement);
      this.isPositioned = true;
      this.cdr.detectChanges();
    }
  }

  focusFirstItem() {
    const firstEnabledIndex = this.items.findIndex(item => !item.disabled && !item.separator);
    if (firstEnabledIndex !== -1) {
      this.activeIndex = firstEnabledIndex;
    }
  }

  onItemClick(item: ContextMenuItem) {
    if (item.disabled || item.separator) return;

    if (item.submenu) {
      // Toggle logic handled by enter/leave mostly, but click can force toggle
      if (this.openSubmenuId === item.id) {
        this.closeSubmenu();
      } else {
        // We need the button ref to open it via click. 
        // Implementation detail: Hover is preferred for submenus.
      }
    } else {
      this.contextMenuService.performAction(item.id!);
    }
  }

  onItemMouseEnter(item: ContextMenuItem, trigger: HTMLButtonElement) {
    if (item.disabled || item.separator) return;

    // Clear any pending close actions
    clearTimeout(this.submenuTimeout);

    this.submenuTimeout = setTimeout(() => {
      if (item.submenu) {
        this.openSubmenuId = item.id!;
        this.activeSubmenuTrigger = trigger; // Save the trigger for positioning
        this.positionSubmenu();
      } else {
        this.closeSubmenu();
      }
    }, 150);
  }

  onItemMouseLeave() {
    // We don't close immediately; we wait to see if the user enters the submenu
    // Logic handled by the timeout in `onItemMouseEnter` of a sibling, 
    // or we could add a timeout here to close if they go nowhere.
  }

  onSubmenuMouseEnter() {
    // If user is hovering the submenu, keep it open
    clearTimeout(this.submenuTimeout);
  }

  onSubmenuMouseLeave() {
    // If user leaves submenu, standard behavior is usually to keep it open 
    // until they hover another main item or click away.
  }

  private closeSubmenu() {
    this.openSubmenuId = null;
    this.activeSubmenuTrigger = null;
    this.isSubmenuPositioned = false;
  }

  private async positionSubmenu() {
    this.isSubmenuPositioned = false;
    this.cdr.detectChanges(); // Render the submenu DOM

    requestAnimationFrame(async () => {
      if (this.activeSubmenuTrigger && this.submenuElement) {
        await this.contextMenuService.positionSubmenu(
          this.activeSubmenuTrigger,
          this.submenuElement.nativeElement
        );
        this.isSubmenuPositioned = true;
        this.cdr.detectChanges();
      }
    });
  }

  onSubItemClick(item: ContextMenuItem) {
    if (item.disabled || item.separator) return;
    this.contextMenuService.performAction(item.id!);
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigate(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigate(-1);
        break;
      case 'ArrowRight':
        const currentItem = this.items[this.activeIndex];
        if (currentItem?.submenu) {
          event.preventDefault();
          // Force open submenu via keyboard
          this.openSubmenuId = currentItem.id!;
          const trigger = this.itemButtons.toArray()[this.activeIndex]?.nativeElement;
          if (trigger) {
            this.activeSubmenuTrigger = trigger;
            this.positionSubmenu();
          }
        }
        break;
      case 'ArrowLeft':
        if (this.openSubmenuId) {
          event.preventDefault();
          this.closeSubmenu();
        }
        break;
      case 'Enter':
        if (this.activeIndex !== -1) {
          event.preventDefault();
          this.onItemClick(this.items[this.activeIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.contextMenuService.close();
        break;
    }
  }

  private navigate(direction: number) {
    let nextIndex = this.activeIndex + direction;
    const count = this.items.length;
    while (nextIndex >= 0 && nextIndex < count) {
      const item = this.items[nextIndex];
      if (!item.disabled && !item.separator) {
        this.activeIndex = nextIndex;
        return;
      }
      nextIndex += direction;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.contextMenuService.close();
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
    clearTimeout(this.submenuTimeout);
  }
}