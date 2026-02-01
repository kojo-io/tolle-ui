import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { cn } from './utils/cn';

// --- Interfaces ---
export type SidebarItem = {
  title: string;
  url?: string;
  icon?: string;
  isActive?: boolean;
  items?: SidebarItem[];
  id?: string;
  expanded?: boolean;
}

export type SidebarGroup = {
  title: string;
  items: SidebarItem[];
  id?: string;
}

@Component({
  selector: 'tolle-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside [class]="cn(
      'flex flex-col h-full bg-background transition-[width] duration-300 ease-in-out shrink-0 overflow-hidden',
      collapsed ? 'w-16' : 'w-64',
      class
    )">
      <div class="flex h-14 shrink-0 items-center px-3 overflow-hidden whitespace-nowrap">
        <ng-content select="[header]"></ng-content>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-4 px-3">

        @for (group of items; track group.id || group.title || $index; let gIndex = $index) {
          <div class="mb-6">

            <div [class]="cn(
              'mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 transition-all duration-200 overflow-hidden',
              collapsed ? 'opacity-0 h-0 mb-0 px-0' : 'opacity-100 h-auto'
            )">
              {{ group.title }}
            </div>

            <div class="flex flex-col gap-1">
              @for (item of group.items; track item.id || item.title || $index; let i = $index) {

                @if (item.items && item.items.length) {
                  <!-- Parent Item (Group) -->
                  <div class="relative">
                    <button
                      type="button"
                      (click)="toggleParent(group, item, gIndex, i)"
                      [disabled]="collapsed"
                      [attr.aria-expanded]="isParentExpanded(group, item, gIndex, i)"
                      [class]="cn(
                        'group w-full relative flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        isParentExpanded(group, item, gIndex, i) ? 'text-foreground bg-accent/50' : 'text-muted-foreground',
                        collapsed ? 'justify-center' : 'justify-start'
                      )"
                    >
                      <i [class]="cn(
                          item.icon || 'ri-circle-fill',
                          'h-4 w-4 text-lg shrink-0 transition-transform',
                          !collapsed && 'group-hover:scale-110'
                        )"></i>

                      <span [class]="cn(
                        'truncate transition-all duration-300',
                        collapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-3'
                      )">
                        {{ item.title }}
                      </span>

                      @if (!collapsed) {
                        <i [class]="cn(
                          'ri-arrow-down-s-line ml-auto transition-transform duration-300',
                          isParentExpanded(group, item, gIndex, i) ? 'rotate-180' : ''
                        )"></i>
                      }
                    </button>

                    <!-- Submenu Grid Transition -->
                    <div [class]="cn(
                      'grid transition-[grid-template-rows] duration-300 ease-in-out',
                      isParentExpanded(group, item, gIndex, i) && !collapsed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )">
                      <div class="overflow-hidden">
                        <div class="flex flex-col gap-1 mt-1 ml-4 border-l border-border/50 pl-2">

                          @for (subItem of item.items; track subItem.id || subItem.title || $index; let j = $index) {
                            @if (subItem.items && subItem.items.length) {
                              <!-- Grandchild Item Group (Recursive-ish logic for depth 2) -->
                              <div class="relative">
                                <button
                                  type="button"
                                  (click)="toggleChild(group, item, subItem, gIndex, i, j); $event.stopPropagation()"
                                  [class]="cn(
                                    'group w-full relative flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                    'hover:bg-accent hover:text-accent-foreground text-muted-foreground',
                                    isChildExpanded(group, item, subItem, gIndex, i, j) ? 'text-foreground bg-accent/30' : ''
                                  )"
                                >
                                  <span class="w-1.5 h-1.5 rounded-full bg-border shrink-0"></span>
                                  <span class="ml-2 truncate">{{ subItem.title }}</span>
                                  <i [class]="cn(
                                    'ri-arrow-right-s-line ml-auto transition-transform duration-300 text-xs',
                                    isChildExpanded(group, item, subItem, gIndex, i, j) ? 'rotate-90' : ''
                                  )"></i>
                                </button>

                                <div [class]="cn(
                                  'grid transition-[grid-template-rows] duration-300 ease-in-out',
                                  isChildExpanded(group, item, subItem, gIndex, i, j) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                )">
                                  <div class="overflow-hidden">
                                    <div class="flex flex-col gap-1 mt-1 ml-4 border-l border-border/30 pl-2">
                                      @for (grandChild of subItem.items; track grandChild.title) {
                                        <a
                                          [routerLink]="grandChild.url"
                                          [routerLinkActive]="activeClasses"
                                          [routerLinkActiveOptions]="{ exact: true }"
                                          class="flex items-center gap-2 hover:no-underline rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground whitespace-nowrap"
                                        >
                                          <span class="w-1.5 h-1.5 rounded-full bg-border/70 shrink-0"></span>
                                          <span class="truncate">{{ grandChild.title }}</span>
                                        </a>
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            }
                            @else {
                              <!-- Standard Sub Item -->
                              <a
                                [routerLink]="subItem.url"
                                [routerLinkActive]="activeClasses"
                                [routerLinkActiveOptions]="{ exact: true }"
                                class="flex items-center gap-2 hover:no-underline rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground whitespace-nowrap"
                              >
                                <span class="w-1.5 h-1.5 rounded-full bg-border shrink-0"></span>
                                <span class="truncate">{{ subItem.title }}</span>
                              </a>
                            }
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }
                @else {
                  <!-- Standard Top-Level Item -->
                  <a
                    [routerLink]="item.url"
                    [routerLinkActive]="activeClasses"
                    [routerLinkActiveOptions]="{ exact: true }"
                    [class]="cn(
                      'group relative hover:no-underline flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      'hover:bg-accent hover:text-accent-foreground text-muted-foreground',
                      collapsed ? 'justify-center' : 'justify-start'
                    )"
                  >
                    <i [class]="cn(
                        item.icon || 'ri-circle-fill',
                        'h-4 w-4 text-lg shrink-0 transition-transform',
                        !collapsed && 'group-hover:scale-110'
                      )"></i>
                    <span [class]="cn(
                      'truncate transition-all duration-300',
                      collapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-3'
                    )">
                      {{ item.title }}
                    </span>
                  </a>
                }
              }
            </div>
          </div>
        }
      </div>

      <div class="shrink-0 p-3 overflow-hidden whitespace-nowrap">
        <ng-content select="[footer]"></ng-content>
      </div>
    </aside>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    button:disabled { cursor: not-allowed; opacity: 0.6; }
    * { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
  `]
})
export class SidebarComponent implements OnChanges {
  @Input() items: SidebarGroup[] = [];
  @Input() collapsed = false;
  @Input() class = '';

  /**
   * Styling variant for active items.
   * - default: Solid primary background, light text (Matches Badge Default)
   * - secondary: Solid secondary background
   * - ghost: Transparent background, accent text (Shadcn standard)
   * - outline: Bordered
   */
  @Input() variant: 'default' | 'secondary' | 'ghost' | 'outline' = 'default';

  expandedParents = new Set<string>();
  expandedChildren = new Set<string>();

  protected readonly cn = cn;

  get activeClasses(): string {
    return cn(
      'transition-colors',
      // Default: Solid Primary (Badge-like) with lighter opacity (80% instead of 90%)
      this.variant === 'default' && 'bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground',

      // Secondary: Solid Secondary
      this.variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',

      // Ghost: Subtle background (Sidebar standard)
      this.variant === 'ghost' && 'bg-accent text-accent-foreground',

      // Outline: Bordered
      this.variant === 'outline' && 'border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['collapsed'] && this.collapsed) {
      this.collapseAll();
      return;
    }
    if (changes['items']) {
      this.initializeState();
    }
  }

  // --- STATE INIT ---
  private initializeState() {
    this.collapseAll();
    if (!this.items) return;

    this.items.forEach((group, gIndex) => {
      group.items.forEach((item, iIndex) => {
        const parentId = this.getParentId(group, item, gIndex, iIndex);

        if (item.expanded) {
          this.expandedParents.add(parentId);
        }

        if (item.items) {
          item.items.forEach((subItem, sIndex) => {
            if (subItem.expanded) {
              const childId = this.getChildId(group, item, subItem, gIndex, iIndex, sIndex);
              this.expandedChildren.add(childId);
              this.expandedParents.add(parentId);
            }
          });
        }
      });
    });
  }

  // --- ID GENERATORS ---
  getGroupId(group: SidebarGroup, index: number): string {
    return group.id || group.title || `g-${index}`;
  }

  getParentId(group: SidebarGroup, item: SidebarItem, gIndex: number, iIndex: number): string {
    const groupId = this.getGroupId(group, gIndex);
    const itemId = item.id || item.title || `p-${iIndex}`;
    return `${groupId}__${itemId}`;
  }

  getChildId(group: SidebarGroup, parent: SidebarItem, subItem: SidebarItem, gIndex: number, iIndex: number, sIndex: number): string {
    const parentId = this.getParentId(group, parent, gIndex, iIndex);
    const subItemId = subItem.id || subItem.title || `c-${sIndex}`;
    return `${parentId}__${subItemId}`;
  }

  // --- ACTIONS ---
  toggleParent(group: SidebarGroup, item: SidebarItem, gIndex: number, iIndex: number) {
    if (this.collapsed) return;
    const id = this.getParentId(group, item, gIndex, iIndex);

    const newSet = new Set(this.expandedParents);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    this.expandedParents = newSet;
  }

  toggleChild(group: SidebarGroup, parent: SidebarItem, subItem: SidebarItem, gIndex: number, iIndex: number, sIndex: number) {
    const id = this.getChildId(group, parent, subItem, gIndex, iIndex, sIndex);

    const newSet = new Set(this.expandedChildren);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    this.expandedChildren = newSet;
  }

  private collapseAll() {
    this.expandedParents = new Set();
    this.expandedChildren = new Set();
  }

  // --- TEMPLATE HELPERS ---
  isParentExpanded(group: SidebarGroup, item: SidebarItem, gIndex: number, iIndex: number): boolean {
    return this.expandedParents.has(this.getParentId(group, item, gIndex, iIndex));
  }

  isChildExpanded(group: SidebarGroup, parent: SidebarItem, subItem: SidebarItem, gIndex: number, iIndex: number, sIndex: number): boolean {
    return this.expandedChildren.has(this.getChildId(group, parent, subItem, gIndex, iIndex, sIndex));
  }
}
