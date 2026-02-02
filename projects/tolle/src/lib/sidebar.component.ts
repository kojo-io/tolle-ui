import { Component, input, effect, signal, computed } from '@angular/core';

import { RouterModule } from '@angular/router';
import { cn } from './utils/cn';

// --- Interfaces ---
export type SidebarItem = {
  title: string;
  url?: string;
  icon?: string;
  isActive?: boolean;
  external?: boolean;
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
  imports: [RouterModule],
  template: `
    <aside [class]="cn(
      'flex flex-col h-full bg-background transition-[width] duration-300 ease-in-out shrink-0 overflow-hidden',
      collapsed() ? 'w-16' : 'w-64',
      class()
    )">
      <div class="flex h-14 shrink-0 items-center px-3 overflow-hidden whitespace-nowrap">
        <ng-content select="[header]"></ng-content>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-4 px-3">

        @for (group of items(); track group.id || group.title || $index; let gIndex = $index) {
          <div class="mb-6">

            <div [class]="cn(
              'mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 transition-all duration-200 overflow-hidden',
              collapsed() ? 'opacity-0 h-0 mb-0 px-0' : 'opacity-100 h-auto'
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
                      [disabled]="collapsed()"
                      [attr.aria-expanded]="isParentExpanded(group, item, gIndex, i)"
                      [class]="cn(
                        'group w-full relative flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        isParentExpanded(group, item, gIndex, i) ? 'text-foreground bg-accent/50' : 'text-muted-foreground',
                        collapsed() ? 'justify-center' : 'justify-start'
                      )"
                    >
                      <i [class]="cn(
                          item.icon || 'ri-circle-fill',
                          'h-4 w-4 text-lg shrink-0 transition-transform',
                          !collapsed() && 'group-hover:scale-110'
                        )"></i>

                      <span [class]="cn(
                        'truncate transition-all duration-300',
                        collapsed() ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-3'
                      )">
                        {{ item.title }}
                      </span>

                      @if (!collapsed()) {
                        <i [class]="cn(
                          'ri-arrow-down-s-line ml-auto transition-transform duration-300',
                          isParentExpanded(group, item, gIndex, i) ? 'rotate-180' : ''
                        )"></i>
                      }
                    </button>

                    <!-- Submenu Grid Transition -->
                    <div [class]="cn(
                      'grid transition-[grid-template-rows] duration-300 ease-in-out',
                      isParentExpanded(group, item, gIndex, i) && !collapsed() ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )">
                      <div class="overflow-hidden">
                        <div class="flex flex-col gap-1 mt-1 ml-4 border-l border-border/50 pl-2">

                          @for (subItem of item.items; track subItem.id || subItem.title || $index; let j = $index) {
                            @if (subItem.items && subItem.items.length) {
                              <!-- Grandchild Item Group -->
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
                                        @if (grandChild.external) {
                                          <a
                                            [href]="grandChild.url"
                                            target="_blank"
                                            class="flex items-center gap-2 hover:no-underline rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground whitespace-nowrap"
                                          >
                                            <span class="w-1.5 h-1.5 rounded-full bg-border/70 shrink-0"></span>
                                            <span class="truncate">{{ grandChild.title }}</span>
                                          </a>
                                        } @else {
                                          <a
                                            [routerLink]="grandChild.url"
                                            [routerLinkActive]="activeClasses()"
                                            [routerLinkActiveOptions]="{ exact: true }"
                                            class="flex items-center gap-2 hover:no-underline rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground whitespace-nowrap"
                                          >
                                            <span class="w-1.5 h-1.5 rounded-full bg-border/70 shrink-0"></span>
                                            <span class="truncate">{{ grandChild.title }}</span>
                                          </a>
                                        }
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            }
                            @else {
                              <!-- Standard Sub Item -->
                              @if (subItem.external) {
                                <a
                                  [href]="subItem.url"
                                  target="_blank"
                                  class="flex items-center gap-2 hover:no-underline rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground whitespace-nowrap"
                                >
                                  <span class="w-1.5 h-1.5 rounded-full bg-border shrink-0"></span>
                                  <span class="truncate">{{ subItem.title }}</span>
                                </a>
                              } @else {
                                <a
                                  [routerLink]="subItem.url"
                                  [routerLinkActive]="activeClasses()"
                                  [routerLinkActiveOptions]="{ exact: true }"
                                  class="flex items-center gap-2 hover:no-underline rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground whitespace-nowrap"
                                >
                                  <span class="w-1.5 h-1.5 rounded-full bg-border shrink-0"></span>
                                  <span class="truncate">{{ subItem.title }}</span>
                                </a>
                              }
                            }
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }
                @else {
                  <!-- Standard Top-Level Item -->
                  @if (item.external) {
                    <a
                      [href]="item.url"
                      target="_blank"
                      [class]="cn(
                        'group relative hover:no-underline flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        'hover:bg-accent hover:text-accent-foreground text-muted-foreground',
                        collapsed() ? 'justify-center' : 'justify-start'
                      )"
                    >
                      <i [class]="cn(
                          item.icon || 'ri-circle-fill',
                          'h-4 w-4 text-lg shrink-0 transition-transform',
                          !collapsed() && 'group-hover:scale-110'
                        )"></i>
                      <span [class]="cn(
                        'truncate transition-all duration-300',
                        collapsed() ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-3'
                      )">
                        {{ item.title }}
                      </span>
                    </a>
                  } @else {
                    <a
                      [routerLink]="item.url"
                      [routerLinkActive]="activeClasses()"
                      [routerLinkActiveOptions]="{ exact: true }"
                      [class]="cn(
                        'group relative hover:no-underline flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        'hover:bg-accent hover:text-accent-foreground text-muted-foreground',
                        collapsed() ? 'justify-center' : 'justify-start'
                      )"
                    >
                      <i [class]="cn(
                          item.icon || 'ri-circle-fill',
                          'h-4 w-4 text-lg shrink-0 transition-transform',
                          !collapsed() && 'group-hover:scale-110'
                        )"></i>
                      <span [class]="cn(
                        'truncate transition-all duration-300',
                        collapsed() ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-3'
                      )">
                        {{ item.title }}
                      </span>
                    </a>
                  }
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
export class SidebarComponent {
  items = input<SidebarGroup[]>([]);
  collapsed = input(false);
  class = input('');
  variant = input<'default' | 'secondary' | 'ghost' | 'outline'>('default');

  expandedParents = signal(new Set<string>());
  expandedChildren = signal(new Set<string>());

  protected readonly cn = cn;

  activeClasses = computed(() => {
    const v = this.variant();
    return cn(
      'transition-colors',
      v === 'default' && 'bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground',
      v === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      v === 'ghost' && 'bg-accent text-accent-foreground',
      v === 'outline' && 'border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
    );
  });

  constructor() {
    effect(() => {
      if (this.collapsed()) {
        this.collapseAll();
      }
    });

    effect(() => {
      this.initializeState();
    });
  }

  // --- STATE INIT ---
  private initializeState() {
    this.collapseAll();
    const items = this.items();
    if (!items) return;

    const parents = new Set<string>();
    const children = new Set<string>();

    items.forEach((group: SidebarGroup, gIndex: number) => {
      group.items.forEach((item: SidebarItem, iIndex: number) => {
        const parentId = this.getParentId(group, item, gIndex, iIndex);

        if (item.expanded) {
          parents.add(parentId);
        }

        if (item.items) {
          item.items.forEach((subItem: SidebarItem, sIndex: number) => {
            if (subItem.expanded) {
              const childId = this.getChildId(group, item, subItem, gIndex, iIndex, sIndex);
              children.add(childId);
              parents.add(parentId);
            }
          });
        }
      });
    });

    this.expandedParents.set(parents);
    this.expandedChildren.set(children);
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
    if (this.collapsed()) return;
    const id = this.getParentId(group, item, gIndex, iIndex);

    this.expandedParents.update((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  toggleChild(group: SidebarGroup, parent: SidebarItem, subItem: SidebarItem, gIndex: number, iIndex: number, sIndex: number) {
    const id = this.getChildId(group, parent, subItem, gIndex, iIndex, sIndex);

    this.expandedChildren.update((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  private collapseAll() {
    this.expandedParents.set(new Set());
    this.expandedChildren.set(new Set());
  }

  // --- TEMPLATE HELPERS ---
  isParentExpanded(group: SidebarGroup, item: SidebarItem, gIndex: number, iIndex: number): boolean {
    return this.expandedParents().has(this.getParentId(group, item, gIndex, iIndex));
  }

  isChildExpanded(group: SidebarGroup, parent: SidebarItem, subItem: SidebarItem, gIndex: number, iIndex: number, sIndex: number): boolean {
    return this.expandedChildren().has(this.getChildId(group, parent, subItem, gIndex, iIndex, sIndex));
  }
}
