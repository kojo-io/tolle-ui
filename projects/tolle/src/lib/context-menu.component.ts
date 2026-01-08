import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
        class="fixed inset-0 z-50 bg-transparent"
        (click)="onBackdropClick($event)"
        (contextmenu)="onBackdropClick($event)"
      >
        <div
          #menu
          [attr.data-state]="isOpen ? 'open' : 'closed'"
          class="z-50 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md
                 data-[state=open]:animate-in data-[state=closed]:animate-out
                 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                 slide-in-from-top-2"
        >
          <!-- Menu Items -->
          <div class="flex flex-col">
            @for (item of items; track item.id) {

              @if (item.separator) {
                <div class="h-px -mx-1 my-1 bg-border"></div>
              }

              @else {
                <div class="relative group">
                  <!-- Standard Item / Submenu Trigger -->
                  <button
                    type="button"
                    (click)="onItemClick(item)"
                    (mouseenter)="onItemMouseEnter(item)"
                    [disabled]="item.disabled"
                    [class]="cn(
                      'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                      'transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground',
                      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                      item.destructive ? 'text-destructive focus:bg-destructive/10 focus:text-destructive' : '',
                      item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                    )"
                  >
                    <!-- Icon -->
                    @if (item.icon) {
                      <i [class]="cn(item.icon, 'mr-2 h-4 w-4')"></i>
                    }

                    <!-- Label -->
                    <span class="flex-1 text-left">{{ item.label }}</span>

                    <!-- Submenu Arrow -->
                    @if (item.submenu) {
                      <i class="ri-arrow-right-s-line ml-auto h-4 w-4 opacity-50"></i>
                    }
                  </button>

                  <!-- Submenu Popup -->
                  @if (item.submenu && openSubmenuId === item.id) {
                    <div
                      class="absolute left-full top-0 ml-1 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md
                             animate-in slide-in-from-left-1 duration-200"
                    >
                      @for (subItem of item.submenu; track subItem.id) {
                        @if (subItem.separator) {
                          <div class="h-px -mx-1 my-1 bg-border"></div>
                        } @else {
                          <button
                            type="button"
                            (click)="onSubItemClick(subItem)"
                            [disabled]="subItem.disabled"
                            [class]="cn(
                              'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                              'transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              subItem.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                              subItem.destructive ? 'text-destructive hover:bg-destructive/10' : ''
                            )"
                          >
                            @if (subItem.icon) {
                              <i [class]="cn(subItem.icon, 'mr-2 h-4 w-4')"></i>
                            }
                            <span class="flex-1 text-left">{{ subItem.label }}</span>
                          </button>
                        }
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: contents; }
  `]
})
export class ContextMenuComponent implements OnInit, OnDestroy {
  private contextMenuService = inject(ContextMenuService);
  private elementRef = inject(ElementRef);

  @ViewChild('menu') menuElement!: ElementRef<HTMLDivElement>;

  isOpen = false;
  items: ContextMenuItem[] = [];
  openSubmenuId: string | null = null;
  private stateSubscription: any;

  protected readonly cn = cn;

  ngOnInit() {
    this.stateSubscription = this.contextMenuService.stateChanged.subscribe((state: ContextMenuState) => {
      this.isOpen = state.isOpen;
      this.items = state.items;

      if (state.isOpen) {
        // Use setTimeout to allow the view to render the #menu element before positioning
        setTimeout(() => this.positionMenu());
      } else {
        this.openSubmenuId = null;
      }
    });
  }

  async positionMenu() {
    if (this.menuElement?.nativeElement) {
      await this.contextMenuService.positionMenu(this.menuElement.nativeElement);
    }
  }

  onItemClick(item: ContextMenuItem) {
    if (item.disabled) return;

    if (item.submenu) {
      // If clicking a submenu trigger, toggle it (good for touch devices)
      this.toggleSubmenu(item.id);
    } else {
      this.contextMenuService.performAction(item.id);
    }
  }

  onItemMouseEnter(item: ContextMenuItem) {
    if (item.disabled) return;

    if (item.submenu) {
      this.openSubmenuId = item.id;
    } else {
      // Close other submenus if hovering over a regular item
      this.openSubmenuId = null;
    }
  }

  onSubItemClick(item: ContextMenuItem) {
    if (item.disabled) return;
    this.contextMenuService.performAction(item.id);
  }

  toggleSubmenu(itemId: string) {
    this.openSubmenuId = this.openSubmenuId === itemId ? null : itemId;
  }

  onBackdropClick(event: MouseEvent) {
    event.preventDefault(); // Prevent default context menu on backdrop
    this.contextMenuService.close();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.contextMenuService.close();
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }
}
