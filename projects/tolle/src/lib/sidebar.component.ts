import { Component, Input, Output, EventEmitter, signal, computed, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { cn } from './utils/cn';

export interface SidebarItem {
  title: string;
  url?: string;
  icon?: string; // Icon name (Lucide/FontAwesome/Remix)
  isActive?: boolean;
  items?: SidebarItem[]; // For nested navigation
}

@Component({
  selector: 'tolle-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside [class]="cn(
    'flex flex-col h-full border-r bg-background transition-all duration-300 ease-in-out shrink-0',
    collapsed ? 'w-16' : 'w-64',
    class
  )">
      <div class="flex h-14 shrink-0 items-center border-b">
        <ng-content select="[header]"></ng-content>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-4 px-2">
        @for (group of items; track group.title) {
          <div class="mb-4">
            @if (!collapsed && group.title) {
              <h4 class="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {{ group.title }}
              </h4>
            }
            <div class="flex flex-col gap-1">
              @for (item of group.items; track item.title) {
                <a [class.justify-center]="collapsed"
                   routerLinkActive="bg-accent text-accent-foreground"
                   class="group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  <i [class]="cn(item.icon || 'ri-circle-fill', 'h-4 w-4 shrink-0 transition-transform group-hover:scale-110')"></i>
                  @if (!collapsed) {
                    <span class="truncate">{{ item.title }}</span>
                  }
                </a>
              }
            </div>
          </div>
        }
      </div>

      <div class="border-t shrink-0">
        <ng-content select="[footer]"></ng-content>
      </div>
    </aside>
  `,
  styles: [`
    :host { display: block; } /* Removed h-100vh here to let parent control height */
  `]
})
export class SidebarComponent {
  @Input() items: { title: string; items: SidebarItem[] }[] = [];
  @Input() collapsed = false;
  @Input() class = '';

  protected readonly cn = cn;
}
