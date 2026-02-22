# Sidebar Component Usage Guide

## Overview

The Sidebar component is a navigation component that provides a responsive side navigation bar with collapse/expand functionality. It includes support for navigation items, groups, and collapsible sections.

## Import

```typescript
import { SidebarComponent } from '@tolle_/tolle-ui';
```

## Component

### SidebarComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `isOpen` | `boolean` | `true` | Sidebar open state |
| `collapsible` | `boolean` | `true` | Enable collapse/expand |
| `collapsedWidth` | `number` | `80` | Width in collapsed state (px) |
| `expandedWidth` | `number` | `280` | Width in expanded state (px) |
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Basic Sidebar

```html
<tolle-sidebar>
  <nav class="space-y-2">
    <a href="/" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent text-accent-foreground">
      <i class="ri-dashboard-line"></i>
      <span>Dashboard</span>
    </a>
    <a href="/users" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent">
      <i class="ri-user-line"></i>
      <span>Users</span>
    </a>
    <a href="/settings" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent">
      <i class="ri-settings-line"></i>
      <span>Settings</span>
    </a>
  </nav>
</tolle-sidebar>
```

### Collapsible Sidebar

```html
<tolle-sidebar [collapsible]="true">
  <div class="flex items-center justify-between p-4">
    <span class="font-semibold">My App</span>
  </div>
  <nav class="space-y-2 px-2">
    <a href="/dashboard" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
      <i class="ri-dashboard-line"></i>
      <span>Dashboard</span>
    </a>
    <a href="/analytics" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
      <i class="ri-bar-chart-line"></i>
      <span>Analytics</span>
    </a>
    <a href="/settings" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
      <i class="ri-settings-line"></i>
      <span>Settings</span>
    </a>
  </nav>
</tolle-sidebar>
```

### Default Collapsed

```html
<tolle-sidebar [isOpen]="false">
  <nav class="space-y-2 px-2">
    <a href="/dashboard" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
      <i class="ri-dashboard-line"></i>
      <span>Dashboard</span>
    </a>
  </nav>
</tolle-sidebar>
```

## Sidebar with Groups

```html
<tolle-sidebar>
  <nav class="space-y-4">
    <!-- Main Navigation -->
    <div>
      <h3 class="px-4 text-xs font-medium text-muted-foreground uppercase">Main</h3>
      <div class="space-y-1 px-2">
        <a href="/dashboard" class="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent text-accent-foreground">
          <i class="ri-dashboard-line"></i>
          <span>Dashboard</span>
        </a>
        <a href="/analytics" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
          <i class="ri-bar-chart-line"></i>
          <span>Analytics</span>
        </a>
      </div>
    </div>

    <!-- Projects -->
    <div>
      <h3 class="px-4 text-xs font-medium text-muted-foreground uppercase">Projects</h3>
      <div class="space-y-1 px-2">
        <a href="/projects" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
          <i class="ri-folder-line"></i>
          <span>All Projects</span>
        </a>
        <a href="/projects/new" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
          <i class="ri-add-circle-line"></i>
          <span>New Project</span>
        </a>
      </div>
    </div>
  </nav>
</tolle-sidebar>
```

## Collapsible Sidebar Section

```html
<tolle-sidebar>
  <nav class="space-y-4">
    <a href="/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent text-accent-foreground">
      <i class="ri-dashboard-line"></i>
      <span>Dashboard</span>
    </a>

    <div>
      <h3 class="px-4 text-xs font-medium text-muted-foreground uppercase mb-2">Team</h3>
      <div class="space-y-1 px-2">
        <a href="/team/members" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
          <i class="ri-user-group-line"></i>
          <span>Members</span>
        </a>
        <a href="/team/invitations" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
          <i class="ri-send-plane-line"></i>
          <span>Invitations</span>
        </a>
      </div>
    </div>
  </nav>
</tolle-sidebar>
```

## Sidebar with Icons Only (Collapsed)

```html
<tolle-sidebar [collapsedWidth]="60" [expandedWidth]="60" [collapsible]="false">
  <nav class="space-y-2 py-4">
    <a href="/dashboard" class="flex items-center justify-center p-3 rounded-lg hover:bg-accent">
      <i class="ri-dashboard-line text-xl"></i>
    </a>
    <a href="/analytics" class="flex items-center justify-center p-3 rounded-lg hover:bg-accent">
      <i class="ri-bar-chart-line text-xl"></i>
    </a>
    <a href="/settings" class="flex items-center justify-center p-3 rounded-lg hover:bg-accent">
      <i class="ri-settings-line text-xl"></i>
    </a>
  </nav>
</tolle-sidebar>
```

## Responsive Sidebar

```html
<div class="flex h-screen overflow-hidden">
  <!-- Sidebar -->
  <tolle-sidebar class="hidden md:block w-64 flex-shrink-0">
    <div class="flex items-center gap-3 px-6 py-4">
      <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
        <i class="ri-team-line text-white"></i>
      </div>
      <span class="font-bold text-lg">App</span>
    </div>
    <nav class="space-y-1 px-3 mt-4">
      <a href="/dashboard" class="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent text-accent-foreground">
        <i class="ri-dashboard-line"></i>
        <span>Dashboard</span>
      </a>
      <a href="/projects" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
        <i class="ri-folder-line"></i>
        <span>Projects</span>
      </a>
      <a href="/team" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
        <i class="ri-user-group-line"></i>
        <span>Team</span>
      </a>
    </nav>
  </tolle-sidebar>

  <!-- Main Content -->
  <div class="flex-1 overflow-auto bg-background">
    <div class="p-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-muted-foreground mt-2">Welcome back!</p>
    </div>
  </div>
</div>
```

## Toggle Sidebar State

```html
<tolle-sidebar #sidebar [collapsible]="true">
  <nav class="space-y-2 px-2">
    <a href="/dashboard" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
      <i class="ri-dashboard-line"></i>
      <span>Dashboard</span>
    </a>
  </nav>
</tolle-sidebar>

<button (click)="sidebar.isOpen = !sidebar.isOpen">
  <i class="ri-menu-line"></i>
</button>
```

## Collapsible Sidebar with State Binding

```html
<tolle-sidebar
  #sidebar
  [(isOpen)]="sidebarOpen"
  [collapsible]="true"
>
  <nav class="space-y-2 px-2">
    <a href="/dashboard" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
      <i class="ri-dashboard-line"></i>
      <span>Dashboard</span>
    </a>
  </nav>
</tolle-sidebar>
```

```typescript
sidebarOpen = true;

toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
}
```

## Sidebar Layout with Header

```html
<div class="flex h-screen overflow-hidden bg-background">
  <tolle-sidebar [collapsible]="true" class="border-r">
    <div class="flex items-center gap-3 p-4 border-b">
      <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
        <i class="ri-logo-react-line text-white"></i>
      </div>
      <span class="font-bold text-lg" *ngIf="sidebarOpen">App</span>
    </div>
    <nav class="space-y-1 px-2 py-4">
      <a href="/dashboard" class="flex items-center gap-3 px-3 py-2 rounded-lg">
        <i class="ri-dashboard-line"></i>
        <span *ngIf="sidebarOpen">Dashboard</span>
      </a>
      <a href="/projects" class="flex items-center gap-3 px-3 py-2 rounded-lg">
        <i class="ri-folder-line"></i>
        <span *ngIf="sidebarOpen">Projects</span>
      </a>
    </nav>
  </tolle-sidebar>

  <div class="flex-1 flex flex-col overflow-hidden">
    <header class="h-16 border-b flex items-center px-6 bg-background">
      <button (click)="sidebar.toggle()" class="md:hidden">
        <i class="ri-menu-line"></i>
      </button>
      <h1 class="ml-4 font-semibold">Dashboard</h1>
    </header>
    <main class="flex-1 overflow-auto p-6">
      <!-- Page content -->
    </main>
  </div>
</div>
```

## Accessibility

- Keyboard navigation support
- Proper ARIA attributes
- Focus management
- Screen reader friendly
