import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, viewChild, viewChildren, signal, computed, effect, ChangeDetectorRef } from '@angular/core';

import { ContextMenuItem, ContextMenuService } from './context-menu.service';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-context-menu',
  standalone: true,
  imports: [],
  template: `
    @if (isOpen()) {
      <div
        #menu
        role="menu"
        aria-orientation="vertical"
        [attr.data-state]="isOpen() ? 'open' : 'closed'"
        class="fixed z-50 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md
               data-[state=closed]:animate-out
               data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
               data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
               slide-in-from-top-2"
        [style.visibility]="isPositioned() ? 'visible' : 'hidden'"
        [style.opacity]="isPositioned() ? '1' : '0'"
        style="will-change: transform; top: 0; left: 0;"
        (keydown)="onKeyDown($event)"
      >
        <div class="flex flex-col">
          @for (item of items(); track $index) {
            @if (item.separator) {
              <div role="separator" class="h-px -mx-1 my-1 bg-border"></div>
            } @else {
              <div class="relative group">
                <button
                  #itemButton
                  type="button"
                  role="menuitem"
                  [attr.aria-haspopup]="item.submenu ? 'true' : null"
                  [attr.aria-expanded]="openSubmenuId() === item.id ? 'true' : null"
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
                    activeIndex() === $index && 'bg-accent text-accent-foreground'
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

      @if (openSubmenuId() && activeSubmenuItems().length > 0) {
        <div
          #submenu
          role="menu"
          [id]="'submenu-' + openSubmenuId()"
          class="fixed z-50 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
          [style.visibility]="isSubmenuPositioned() ? 'visible' : 'hidden'"
          [style.opacity]="isSubmenuPositioned() ? '1' : '0'"
          style="will-change: transform"
          (mouseenter)="onSubmenuMouseEnter()"
          (mouseleave)="onSubmenuMouseLeave()"
        >
          @for (subItem of activeSubmenuItems(); track $index) {
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
  private cdr = inject(ChangeDetectorRef);

  menuElement = viewChild<ElementRef<HTMLDivElement>>('menu');
  submenuElement = viewChild<ElementRef<HTMLDivElement>>('submenu');
  itemButtons = viewChildren<ElementRef<HTMLButtonElement>>('itemButton');

  isOpen = signal(false);
  isPositioned = signal(false);
  isSubmenuPositioned = signal(false);
  items = signal<ContextMenuItem[]>([]);

  openSubmenuId = signal<string | null>(null);
  activeSubmenuTrigger = signal<HTMLElement | null>(null);

  activeIndex = signal(-1);
  private submenuTimeout: any;

  protected readonly cn = cn;

  constructor() {
    effect(() => {
      const state = this.contextMenuService.state();
      this.isOpen.set(state.isOpen);
      this.items.set(state.items);

      if (state.isOpen) {
        this.activeIndex.set(-1);
        this.isPositioned.set(false);
        this.cdr.detectChanges();
        requestAnimationFrame(() => {
          this.positionMenu();
          this.focusFirstItem();
        });
      } else {
        this.closeSubmenu();
        this.activeIndex.set(-1);
        this.isPositioned.set(false);
      }
    });
  }

  ngOnInit() { }

  activeSubmenuItems = computed(() => {
    const subId = this.openSubmenuId();
    if (!subId) return [];
    return this.items().find((i: ContextMenuItem) => i.id === subId)?.submenu || [];
  });

  @HostListener('document:click', ['$event'])
  @HostListener('document:contextmenu', ['$event'])
  onDocumentEvents(event: MouseEvent) {
    if (!this.isOpen()) return;

    const clickedInsideMenu = this.menuElement()?.nativeElement.contains(event.target as Node);
    const clickedInsideSubmenu = this.submenuElement()?.nativeElement.contains(event.target as Node);

    if (clickedInsideMenu || clickedInsideSubmenu) {
      return;
    }

    this.contextMenuService.close();
  }

  async positionMenu() {
    const el = this.menuElement()?.nativeElement;
    if (el) {
      this.isPositioned.set(false);
      this.cdr.detectChanges();
      await this.contextMenuService.positionMenu(el);
      this.isPositioned.set(true);
      this.cdr.detectChanges();
    }
  }

  focusFirstItem() {
    const firstEnabledIndex = this.items().findIndex((item: ContextMenuItem) => !item.disabled && !item.separator);
    if (firstEnabledIndex !== -1) {
      this.activeIndex.set(firstEnabledIndex);
    }
  }

  onItemClick(item: ContextMenuItem) {
    if (item.disabled || item.separator) return;

    if (item.submenu) {
      if (this.openSubmenuId() === item.id) {
        this.closeSubmenu();
      }
    } else {
      this.contextMenuService.performAction(item.id!);
    }
  }

  onItemMouseEnter(item: ContextMenuItem, trigger: HTMLButtonElement) {
    if (item.disabled || item.separator) return;

    clearTimeout(this.submenuTimeout);

    this.submenuTimeout = setTimeout(() => {
      if (item.submenu) {
        this.openSubmenuId.set(item.id!);
        this.activeSubmenuTrigger.set(trigger);
        this.positionSubmenu();
      } else {
        this.closeSubmenu();
      }
    }, 150);
  }

  onItemMouseLeave() { }

  onSubmenuMouseEnter() {
    clearTimeout(this.submenuTimeout);
  }

  onSubmenuMouseLeave() { }

  private closeSubmenu() {
    this.openSubmenuId.set(null);
    this.activeSubmenuTrigger.set(null);
    this.isSubmenuPositioned.set(false);
  }

  private async positionSubmenu() {
    this.isSubmenuPositioned.set(false);
    this.cdr.detectChanges();

    requestAnimationFrame(async () => {
      const trigger = this.activeSubmenuTrigger();
      const el = this.submenuElement()?.nativeElement;
      if (trigger && el) {
        await this.contextMenuService.positionSubmenu(trigger, el);
        this.isSubmenuPositioned.set(true);
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
        const currentItems = this.items();
        const currentItem = currentItems[this.activeIndex()];
        if (currentItem?.submenu) {
          event.preventDefault();
          this.openSubmenuId.set(currentItem.id!);
          const buttons = this.itemButtons();
          const trigger = buttons[this.activeIndex()]?.nativeElement;
          if (trigger) {
            this.activeSubmenuTrigger.set(trigger);
            this.positionSubmenu();
          }
        }
        break;
      case 'ArrowLeft':
        if (this.openSubmenuId()) {
          event.preventDefault();
          this.closeSubmenu();
        }
        break;
      case 'Enter':
        if (this.activeIndex() !== -1) {
          event.preventDefault();
          this.onItemClick(this.items()[this.activeIndex()]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.contextMenuService.close();
        break;
    }
  }

  private navigate(direction: number) {
    let nextIndex = this.activeIndex() + direction;
    const items = this.items();
    const count = items.length;
    while (nextIndex >= 0 && nextIndex < count) {
      const item = items[nextIndex];
      if (!item.disabled && !item.separator) {
        this.activeIndex.set(nextIndex);
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
    clearTimeout(this.submenuTimeout);
  }
}