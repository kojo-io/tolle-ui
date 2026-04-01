# Empty State Component Usage Guide

## Overview

The EmptyState component displays a placeholder when there's no content to show. It includes a default icon, title, and description that can be customized.

## Import

```typescript
import { EmptyStateComponent } from '@tolle_/tolle-ui';
```

## EmptyStateComponent

**Inputs:**

| Input         | Type                   | Default            | Description            |
| ------------- | ---------------------- | ------------------ | ---------------------- |
| `variant`     | `'default'\|'minimal'` | `'default'`        | Variant style          |
| `title`       | `string`               | `'No items found'` | Title text             |
| `description` | `string`               | -                  | Description text       |
| `class`       | `string`               | `''`               | Additional CSS classes |

## Basic Usage

### Basic Empty State

```html
<tolle-empty-state
  title="No projects found"
  description="You haven't created any projects yet. Get started by creating your first project.">
  <i icon class="ri-folder-open-line text-3xl text-muted-foreground/60"></i>
  <div actions class="flex gap-2">
    <tolle-button variant="outline" size="sm">Import Project</tolle-button>
    <tolle-button size="sm">Create Project</tolle-button>
  </div>
</tolle-empty-state>
```

### No Search Results

```html
<tolle-empty-state
  title="No results found"
  description="Try adjusting your search or filters to find what you're looking for.">
  <i icon class="ri-search-line text-4xl text-muted-foreground/60"></i>
</tolle-empty-state>
```

### Empty Inbox

```html
<tolle-empty-state
  title="Your inbox is empty"
  description="When you receive messages, they'll appear here.">
  <i icon class="ri-mail-line text-4xl text-muted-foreground/60"></i>
  <div actions>
    <tolle-button>Compose Message</tolle-button>
  </div>
</tolle-empty-state>
```

### Empty Cart

```html
<tolle-empty-state
  title="Your cart is empty"
  description="Looks like you haven't added any items to your cart yet.">
  <i icon class="ri-shopping-cart-line text-4xl text-muted-foreground/60"></i>
  <div actions>
    <tolle-button>Browse Products</tolle-button>
  </div>
</tolle-empty-state>
```

### No Notifications

```html
<tolle-empty-state
  variant="minimal"
  title="All caught up!"
  description="You have no new notifications.">
  <i icon class="ri-notification-off-line text-3xl text-muted-foreground/60"></i>
</tolle-empty-state>
```

### No Data (Minimal Variant)

```html
<tolle-empty-state variant="minimal" description="No data available for this time range.">
  <i icon class="ri-line-chart-line text-2xl text-muted-foreground/60"></i>
</tolle-empty-state>
```

### Error State

```html
<tolle-empty-state
  title="Something went wrong"
  description="We couldn't load your data. Please try again.">
  <i icon class="ri-error-warning-line text-4xl text-destructive"></i>
  <div actions>
    <tolle-button variant="outline" (click)="retry()">Try Again</tolle-button>
  </div>
</tolle-empty-state>
```

### 404 Page

```html
<tolle-empty-state
  title="Page not found"
  description="The page you're looking for doesn't exist or has been moved.">
  <i icon class="ri-file-damage-line text-5xl text-muted-foreground/60"></i>
  <div actions class="flex gap-2">
    <tolle-button variant="outline" (click)="goBack()">Go Back</tolle-button>
    <tolle-button routerLink="/">Go Home</tolle-button>
  </div>
</tolle-empty-state>
```
