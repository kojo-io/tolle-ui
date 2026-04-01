# Sidebar Component Usage Guide

## Overview

The Sidebar component provides a responsive side navigation bar with support for groups, nested navigation, and collapse/expand functionality. It supports multi-level navigation with collapsible sections, icons, and active state indicators.

## Import

```typescript
import { SidebarComponent, SidebarGroup, SidebarItem } from '@tolle_/tolle-ui';
```

## Types

### SidebarItem

| Property   | Type            | Default            | Description                             |
| ---------- | --------------- | ------------------ | --------------------------------------- |
| `title`    | `string`        | -                  | **Required.** Display text for the item |
| `url`      | `string`        | -                  | Router link path                        |
| `icon`     | `string`        | `'ri-circle-fill'` | Icon class string (Remix Icon)          |
| `isActive` | `boolean`       | `false`            | Whether item is active                  |
| `items`    | `SidebarItem[]` | -                  | Nested children items for submenus      |
| `id`       | `string`        | -                  | Optional unique identifier              |
| `expanded` | `boolean`       | `false`            | Initial expansion state for submenus    |

### SidebarGroup

| Property | Type            | Default | Description                                       |
| -------- | --------------- | ------- | ------------------------------------------------- |
| `title`  | `string`        | -       | **Required.** Display label for the group section |
| `items`  | `SidebarItem[]` | -       | **Required.** List of items within the group      |
| `id`     | `string`        | -       | Optional unique identifier                        |

## SidebarComponent

### Inputs

| Input       | Type                                               | Default     | Description                                     |
| ----------- | -------------------------------------------------- | ----------- | ----------------------------------------------- |
| `items`     | `SidebarGroup[]`                                   | `[]`        | Array of sidebar groups and items               |
| `collapsed` | `boolean`                                          | `false`     | Whether the sidebar is in collapsed (mini) mode |
| `variant`   | `'default' \| 'secondary' \| 'ghost' \| 'outline'` | `'default'` | Visual style for active items                   |
| `class`     | `string`                                           | `''`        | Additional CSS classes for the container        |

### Content Slots

| Slot       | Description                                   |
| ---------- | --------------------------------------------- |
| `[header]` | Header content (logo, app name, etc.)         |
| `[footer]` | Footer content (user profile, settings, etc.) |

### Variant Styles

| Variant     | Description                                |
| ----------- | ------------------------------------------ |
| `default`   | Solid primary background with light text   |
| `secondary` | Solid secondary background                 |
| `ghost`     | Subtle accent background (shadcn standard) |
| `outline`   | Bordered background                        |

## Basic Usage

### Simple Sidebar

```typescript
import { Component } from '@angular/core';
import { SidebarComponent, SidebarGroup } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <div class="flex h-screen">
      <tolle-sidebar [items]="sidebarItems" [collapsed]="isCollapsed">
        <div header class="flex items-center gap-2 px-2 text-xl font-bold">
          <i class="ri-app-store-line text-primary"></i>
          <span>MyApp</span>
        </div>

        <div footer class="flex items-center gap-3 border-t border-border px-2 py-4">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <i class="ri-user-line text-primary"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ userName }}</span>
            <span class="text-xs text-muted-foreground">{{ userRole }}</span>
          </div>
        </div>
      </tolle-sidebar>

      <main class="flex-1 bg-muted/10 p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class LayoutComponent {
  isCollapsed = false;
  userName = 'John Doe';
  userRole = 'Developer';

  sidebarItems: SidebarGroup[] = [
    {
      title: 'Navigation',
      items: [
        { title: 'Dashboard', icon: 'ri-home-4-line', url: '/dashboard' },
        { title: 'Analytics', icon: 'ri-bar-chart-box-line', url: '/analytics' },
        { title: 'Messages', icon: 'ri-mail-line', url: '/messages' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { title: 'Profile', icon: 'ri-user-line', url: '/profile' },
        { title: 'Settings', icon: 'ri-settings-line', url: '/settings' },
      ],
    },
  ];
}
```

### Collapsible Sidebar

```typescript
import { Component, signal } from '@angular/core';
import { SidebarComponent, SidebarGroup } from '@tolle_/tolle-ui';
import { ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, ButtonComponent],
  template: `
    <div class="flex h-screen">
      <div class="relative">
        <tolle-sidebar [items]="sidebarItems" [collapsed]="isCollapsed()">
          <div header class="flex items-center gap-2 px-2 font-bold">
            <i class="ri-app-store-line text-xl text-primary"></i>
            <span [class.opacity-0]="isCollapsed()" class="transition-opacity">MyApp</span>
          </div>

          <div footer class="flex items-center gap-3 border-t border-border px-2 py-4">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <i class="ri-user-line text-primary"></i>
            </div>
            <div class="flex flex-col" [class.opacity-0]="isCollapsed()">
              <span class="text-sm font-medium">John Doe</span>
              <span class="text-xs text-muted-foreground">Developer</span>
            </div>
          </div>
        </tolle-sidebar>

        <button
          class="absolute -right-3 top-20 rounded-full border bg-background p-1 shadow-sm"
          (click)="toggleSidebar()">
          <i [class]="isCollapsed() ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'"></i>
        </button>
      </div>

      <main class="flex-1 p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class LayoutComponent {
  isCollapsed = signal(false);

  sidebarItems: SidebarGroup[] = [
    {
      title: 'Main',
      items: [
        { title: 'Dashboard', icon: 'ri-home-4-line', url: '/dashboard' },
        { title: 'Projects', icon: 'ri-folder-line', url: '/projects' },
      ],
    },
  ];

  toggleSidebar() {
    this.isCollapsed.update(v => !v);
  }
}
```

### Nested Navigation (Submenus)

```typescript
import { Component } from '@angular/core';
import { SidebarComponent, SidebarGroup } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <tolle-sidebar [items]="sidebarItems">
      <div header class="flex items-center gap-2 px-2 font-bold">
        <i class="ri-app-store-line text-primary"></i>
        <span>MyApp</span>
      </div>
    </tolle-sidebar>
  `,
})
export class LayoutComponent {
  sidebarItems: SidebarGroup[] = [
    {
      title: 'Dashboard',
      items: [
        { title: 'Overview', icon: 'ri-home-4-line', url: '/dashboard' },
        { title: 'Analytics', icon: 'ri-bar-chart-box-line', url: '/analytics' },
      ],
    },
    {
      title: 'Components',
      items: [
        {
          title: 'Forms',
          icon: 'ri-file-text-line',
          items: [
            { title: 'Input', url: '/components/input' },
            { title: 'Select', url: '/components/select' },
            { title: 'Checkbox', url: '/components/checkbox' },
          ],
        },
        {
          title: 'Navigation',
          icon: 'ri-menu-line',
          items: [
            { title: 'Tabs', url: '/components/tabs' },
            { title: 'Sidebar', url: '/components/sidebar' },
            { title: 'Breadcrumbs', url: '/components/breadcrumbs' },
          ],
        },
      ],
    },
  ];
}
```

### Three-Level Navigation

```typescript
sidebarItems: SidebarGroup[] = [
  {
    title: 'Documentation',
    items: [
      {
        title: 'Getting Started',
        icon: 'ri-rocket-line',
        items: [
          { title: 'Introduction', url: '/docs/intro' },
          { title: 'Installation', url: '/docs/installation' }
        ]
      },
      {
        title: 'Components',
        icon: 'ri-stack-line',
        items: [
          {
            title: 'Form Components',
            items: [
              { title: 'Input', url: '/docs/input' },
              { title: 'Select', url: '/docs/select' }
            ]
          },
          {
            title: 'Navigation Components',
            items: [
              { title: 'Tabs', url: '/docs/tabs' },
              { title: 'Sidebar', url: '/docs/sidebar' }
            ]
          }
        ]
      }
    ]
  }
];
```

### Active State Variants

```typescript
import { Component } from '@angular/core';
import { SidebarComponent, SidebarGroup } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <div class="grid grid-cols-2 gap-4">
      <!-- Default variant (primary solid) -->
      <div>
        <h3 class="mb-2 text-sm font-medium">Default Variant</h3>
        <tolle-sidebar [items]="items" variant="default" class="h-[300px]">
          <div header>Default</div>
        </tolle-sidebar>
      </div>

      <!-- Ghost variant (subtle accent) -->
      <div>
        <h3 class="mb-2 text-sm font-medium">Ghost Variant</h3>
        <tolle-sidebar [items]="items" variant="ghost" class="h-[300px]">
          <div header>Ghost</div>
        </tolle-sidebar>
      </div>
    </div>
  `,
})
export class ExampleComponent {
  items: SidebarGroup[] = [
    {
      title: 'Nav',
      items: [
        { title: 'Home', icon: 'ri-home-line', url: '/home' },
        { title: 'About', icon: 'ri-information-line', url: '/about' },
      ],
    },
  ];
}
```

### Pre-Expanded Items

```typescript
sidebarItems: SidebarGroup[] = [
  {
    title: 'Components',
    items: [
      { title: 'Overview', icon: 'ri-folder-line', url: '/components' },
      {
        title: 'Forms',
        icon: 'ri-file-text-line',
        expanded: true, // Pre-expanded on load
        items: [
          { title: 'Input', url: '/components/input' },
          { title: 'Select', url: '/components/select' }
        ]
      }
    ]
  }
];
```

### With Icons

```typescript
sidebarItems: SidebarGroup[] = [
  {
    title: 'Main',
    items: [
      { title: 'Dashboard', icon: 'ri-dashboard-line', url: '/dashboard' },
      { title: 'Projects', icon: 'ri-folder-line', url: '/projects' },
      { title: 'Team', icon: 'ri-team-line', url: '/team' },
      { title: 'Messages', icon: 'ri-message-line', url: '/messages' },
      { title: 'Calendar', icon: 'ri-calendar-line', url: '/calendar' }
    ]
  },
  {
    title: 'Admin',
    items: [
      { title: 'Users', icon: 'ri-user-settings-line', url: '/admin/users' },
      { title: 'Roles', icon: 'ri-shield-keyhole-line', url: '/admin/roles' },
      { title: 'Settings', icon: 'ri-settings-line', url: '/settings' }
    ]
  }
];
```

### Responsive Sidebar

```typescript
import { Component, signal } from '@angular/core';
import { SidebarComponent, SidebarGroup } from '@tolle_/tolle-ui';
import { ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, ButtonComponent],
  template: `
    <!-- Mobile overlay -->
    @if (mobileOpen()) {
      <div class="fixed inset-0 z-40 bg-black/50 lg:hidden" (click)="mobileOpen.set(false)"></div>
    }

    <!-- Mobile sidebar -->
    <aside
      class="fixed left-0 top-0 z-50 h-full transition-transform lg:hidden"
      [class.translate-x-0]="mobileOpen()"
      [class.-translate-x-full]="!mobileOpen()">
      <tolle-sidebar [items]="sidebarItems" class="h-full">
        <div header class="flex items-center gap-2">
          <i class="ri-app-store-line text-primary"></i>
          <span>MyApp</span>
        </div>
      </tolle-sidebar>
    </aside>

    <!-- Desktop sidebar -->
    <aside class="hidden lg:block">
      <tolle-sidebar [items]="sidebarItems" [collapsed]="isCollapsed()">
        <div header class="flex items-center gap-2">
          <i class="ri-app-store-line text-primary"></i>
          <span>MyApp</span>
        </div>
      </tolle-sidebar>
    </aside>

    <!-- Mobile menu button -->
    <button
      class="fixed left-4 top-4 z-30 rounded-lg border bg-background p-2 lg:hidden"
      (click)="mobileOpen.set(true)">
      <i class="ri-menu-line"></i>
    </button>

    <main class="flex-1 p-4 lg:p-8">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class LayoutComponent {
  mobileOpen = signal(false);
  isCollapsed = signal(false);

  sidebarItems: SidebarGroup[] = [
    {
      title: 'Navigation',
      items: [
        { title: 'Dashboard', icon: 'ri-home-line', url: '/dashboard' },
        { title: 'Projects', icon: 'ri-folder-line', url: '/projects' },
      ],
    },
  ];
}
```

### Complete Layout Example

```typescript
import { Component, signal } from '@angular/core';
import { SidebarComponent, SidebarGroup } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <div class="flex h-screen bg-background">
      <!-- Sidebar -->
      <tolle-sidebar [items]="sidebarItems" [collapsed]="sidebarCollapsed()">
        <!-- Header: Logo -->
        <div header class="flex items-center gap-2 px-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <i class="ri-app-store-line text-primary-foreground"></i>
          </div>
          <span class="text-lg font-semibold">Acme</span>
        </div>

        <!-- Footer: User -->
        <div footer class="flex items-center gap-3 border-t p-2">
          <img src="https://github.com/shadcn.png" class="h-8 w-8 rounded-full" alt="User" />
          <div class="flex flex-col overflow-hidden">
            <span class="truncate text-sm font-medium">John Doe</span>
            <span class="truncate text-xs text-muted-foreground">john@acme.com</span>
          </div>
          <button class="ml-auto rounded p-1 hover:bg-accent">
            <i class="ri-more-2-fill"></i>
          </button>
        </div>
      </tolle-sidebar>

      <!-- Main Content -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Top Bar -->
        <header class="flex h-14 items-center justify-between border-b px-6">
          <button (click)="toggleSidebar()" class="rounded p-2 hover:bg-accent">
            <i [class]="sidebarCollapsed() ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'"></i>
          </button>
          <div class="flex items-center gap-4">
            <button class="rounded p-2 hover:bg-accent">
              <i class="ri-notification-line"></i>
            </button>
            <button class="rounded p-2 hover:bg-accent">
              <i class="ri-settings-line"></i>
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-auto p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class AppComponent {
  sidebarCollapsed = signal(false);

  sidebarItems: SidebarGroup[] = [
    {
      title: 'Platform',
      items: [
        { title: 'Dashboard', icon: 'ri-dashboard-line', url: '/dashboard' },
        { title: 'Analytics', icon: 'ri-bar-chart-line', url: '/analytics' },
        {
          title: 'Projects',
          icon: 'ri-folder-line',
          items: [
            { title: 'All Projects', url: '/projects' },
            { title: 'Active', url: '/projects/active' },
            { title: 'Archived', url: '/projects/archived' },
          ],
        },
        { title: 'Team', icon: 'ri-team-line', url: '/team' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { title: 'Account', icon: 'ri-user-line', url: '/settings/account' },
        { title: 'Billing', icon: 'ri-bank-card-line', url: '/settings/billing' },
        { title: 'Security', icon: 'ri-shield-line', url: '/settings/security' },
      ],
    },
  ];

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }
}
```

## Styling Notes

### Widths

- **Expanded**: `w-64` (256px)
- **Collapsed**: `w-16` (64px)
- Transition duration: `300ms`

### Active States

The `variant` prop controls how active/expanded states are styled:

- `default`: `bg-primary/80 text-primary-foreground`
- `secondary`: `bg-secondary text-secondary-foreground`
- `ghost`: `bg-accent text-accent-foreground`
- `outline`: `border border-border bg-background`

## Accessibility

- Keyboard navigation with arrow keys and Enter
- Screen reader compatible
- Focus management for submenus
- `aria-expanded` attributes on expandable items
- Proper heading structure for groups

## Icons Reference

Use [Remix Icon](https://remixicon.com/) classes with the `ri-` prefix:

| Icon                | Usage            |
| ------------------- | ---------------- |
| `ri-home-line`      | Home/Dashboard   |
| `ri-folder-line`    | Projects/Folders |
| `ri-settings-line`  | Settings         |
| `ri-user-line`      | Profile/User     |
| `ri-dashboard-line` | Dashboard        |
| `ri-bar-chart-line` | Analytics        |
| `ri-message-line`   | Messages         |
| `ri-calendar-line`  | Calendar         |
| `ri-team-line`      | Team             |
| `ri-file-text-line` | Documents        |
