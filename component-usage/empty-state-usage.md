# Empty State Component Usage Guide

## Overview

The EmptyState component displays a placeholder when there's no content to show. It includes a default icon, title, and description that can be customized.

## Import

```typescript
import { EmptyStateComponent } from '@tolle_/tolle-ui';
```

## EmptyStateComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'default'\|'minimal'` | `'default'` | Variant style |
| `title` | `string` | `'No items found'` | Title text |
| `description` | `string` | - | Description text |
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Default Empty State

```html
<empty-state-component />
```

### Custom Title

```html
<empty-state-component title="No messages found" />
```

### With Description

```html
<empty-state-component
  title="No items found"
  description="Try adjusting your search criteria"
/>
```

## Empty State Variants

### Default Variant

```html
<empty-state-component
  variant="default"
  title="No notifications"
  description="You don't have any notifications yet."
/>
```

### Minimal Variant

```html
<empty-state-component
  variant="minimal"
  title="No data"
  description="Start by adding some content"
/>
```

## Empty State with Custom Icon

### Custom Icon Content

```html
<empty-state-component>
  <i icon class="ri-inbox-line text-3xl"></i>
  <h3 class="font-semibold">No Files</h3>
  <p class="text-muted-foreground">You haven't uploaded any files yet.</p>
  <div actions>
    <button tolleButton size="sm">Upload File</button>
  </div>
</empty-state-component>
```

### Custom Icon with ng-content

```html
<empty-state-component>
  <div icon class="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
    <i class="ri-image-line text-3xl text-muted-foreground"></i>
  </div>
  <h3 class="font-semibold mt-4">No Images</h3>
  <p class="text-muted-foreground mt-1">Upload your first image</p>
</empty-state-component>
```

## Empty State with Actions

### Default Actions

```html
<empty-state-component>
  <h3>No Results</h3>
  <p class="text-muted-foreground">Try a different search term</p>
  <div actions>
    <button tolleButton variant="outline">Clear Filters</button>
    <button tolleButton>Reset</button>
  </div>
</empty-state-component>
```

### Minimal with Actions

```html
<empty-state-component variant="minimal">
  <h3>Empty List</h3>
  <div actions>
    <button tolleButton size="sm">Add Item</button>
  </div>
</empty-state-component>
```

## Empty State in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Projects</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content>
    <empty-state-component
      *ngIf="projects.length === 0"
      title="No projects found"
      description="Create your first project to get started"
    >
      <div actions>
        <button tolleButton size="sm" (click)="createProject()">
          Create Project
        </button>
      </div>
    </empty-state-component>

    <div *ngIf="projects.length > 0" class="space-y-4">
      <!-- Project list -->
    </div>
  </tolle-card-content>
</tolle-card>
```

## Empty State in Table

```html
<div class="rounded-md border">
  <table class="w-full">
    <thead class="bg-muted">
      <tr>
        <th class="p-4">Name</th>
        <th class="p-4">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of items">
        <td class="p-4">{{ item.name }}</td>
        <td class="p-4">{{ item.status }}</td>
      </tr>
      <tr *ngIf="items.length === 0">
        <td colspan="2" class="p-8">
          <empty-state-component
            title="No items found"
            description="Try adjusting your filters"
          />
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## Empty State with Image

```html
<empty-state-component>
  <img
    icon
    src="empty-state.png"
    alt="No content"
    class="h-20 w-20 object-contain"
  />
  <h3 class="font-semibold">No Content</h3>
  <p class="text-muted-foreground">Get started by adding your first item</p>
</empty-state-component>
```

## Empty State with Progress

### Loading State

```html
<div *ngIf="isLoading; else loaded">
  <skeleton-component class="h-48 w-full rounded-lg"></skeleton-component>
</div>

<ng-template #loaded>
  <empty-state-component
    *ngIf="items.length === 0"
    title="No items found"
    description="No items match your criteria"
  />
  <div *ngIf="items.length > 0" class="space-y-4">
    <!-- Items -->
  </div>
</ng-template>
```

## Empty State in Modal

```html
<tolle-alert-dialog-content>
  <tolle-alert-dialog-header>
    <tolle-alert-dialog-title>Documents</tolle-alert-dialog-title>
  </tolle-alert-dialog-header>

  <tolle-alert-dialog-content class="max-h-[400px]">
    <empty-state-component
      *ngIf="documents.length === 0"
      title="No documents"
      description="Upload your first document"
    >
      <div actions>
        <button tolleButton size="sm">Upload</button>
      </div>
    </empty-state-component>

    <div *ngIf="documents.length > 0" class="space-y-2">
      <!-- Documents -->
    </div>
  </tolle-alert-dialog-content>
</tolle-alert-dialog-content>
```

## Empty State with Search

```html
<div class="space-y-4">
  <tolle-input
    placeholder="Search items..."
    [(ngModel)]="searchQuery"
  >
    <i prefix class="ri-search-line"></i>
  </tolle-input>

  <empty-state-component
    *ngIf="filteredItems.length === 0"
    title="No matching items"
    description="Try a different search term"
  >
    <div actions>
      <button tolleButton variant="outline" (click)="clearSearch()">
        Clear Search
      </button>
    </div>
  </empty-state-component>

  <div *ngIf="filteredItems.length > 0" class="space-y-2">
    <!-- Filtered items -->
  </div>
</div>
```

## Empty State with Custom Styling

### Custom Variant

```html
<empty-state-component
  class="bg-muted/50 rounded-lg p-8 border border-dashed border-border"
  title="No Content"
  description="Add content to get started"
/>
```

### Dark Mode Empty State

```html
<div class="dark">
  <empty-state-component
    variant="default"
    class="bg-slate-900/50 rounded-lg p-8"
    title="No items"
    description="Start by adding content"
  />
</div>
```

## Empty State with Links

### With Links

```html
<empty-state-component>
  <h3 class="font-semibold">Need help?</h3>
  <p class="text-muted-foreground mt-1">
    Check out our
    <a href="/docs" class="text-primary hover:underline">documentation</a>
    or
    <a href="/support" class="text-primary hover:underline">contact support</a>
  </p>
</empty-state-component>
```
