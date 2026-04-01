# Hover Card Component Usage Guide

## Overview

The HoverCard component displays a floating card that appears when the user hovers over an element. It's commonly used for showing additional information, previews, or quick actions without clicking.

## Import

```typescript
import {
  HoverCardComponent,
  HoverCardTriggerComponent,
  HoverCardContentComponent,
} from '@tolle_/tolle-ui';
```

## Components

### HoverCardComponent

**Inputs:**

| Input        | Type                                     | Default    | Description                    |
| ------------ | ---------------------------------------- | ---------- | ------------------------------ |
| `openDelay`  | `number`                                 | `700`      | Delay before showing card (ms) |
| `closeDelay` | `number`                                 | `300`      | Delay before hiding card (ms)  |
| `placement`  | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Card position                  |

### HoverCardTriggerComponent

The element that triggers the hover card. Typically contains a button, link, or any interactive element.

### HoverCardContentComponent

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

## Basic Usage

### Basic Hover Card

```html
<tolle-hover-card>
  <tolle-hover-card-trigger>
    <tolle-button variant="link" class="p-0">@nextjs</tolle-button>
  </tolle-hover-card-trigger>
  <tolle-hover-card-content class="w-80">
    <div class="flex justify-between space-x-4">
      <tolle-avatar>
        <img src="https://github.com/vercel.png" />
        <tolle-avatar-fallback>VC</tolle-avatar-fallback>
      </tolle-avatar>
      <div class="space-y-1">
        <h4 class="text-sm font-semibold">@nextjs</h4>
        <p class="text-sm">The React Framework – created and maintained by Vercel.</p>
        <div class="flex items-center pt-2 text-xs text-muted-foreground">
          <i class="ri-calendar-line mr-1"></i>
          Joined December 2021
        </div>
      </div>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>
```

### All Placements

```html
<div class="flex flex-wrap justify-center gap-4 p-10">
  <tolle-hover-card placement="top">
    <tolle-hover-card-trigger>
      <tolle-button variant="outline">Hover (Top)</tolle-button>
    </tolle-hover-card-trigger>
    <tolle-hover-card-content>
      <p class="text-sm">Card appears above</p>
    </tolle-hover-card-content>
  </tolle-hover-card>

  <tolle-hover-card placement="bottom">
    <tolle-hover-card-trigger>
      <tolle-button variant="outline">Hover (Bottom)</tolle-button>
    </tolle-hover-card-trigger>
    <tolle-hover-card-content>
      <p class="text-sm">Card appears below</p>
    </tolle-hover-card-content>
  </tolle-hover-card>

  <tolle-hover-card placement="left">
    <tolle-hover-card-trigger>
      <tolle-button variant="outline">Hover (Left)</tolle-button>
    </tolle-hover-card-trigger>
    <tolle-hover-card-content>
      <p class="text-sm">Card appears left</p>
    </tolle-hover-card-content>
  </tolle-hover-card>

  <tolle-hover-card placement="right">
    <tolle-hover-card-trigger>
      <tolle-button variant="outline">Hover (Right)</tolle-button>
    </tolle-hover-card-trigger>
    <tolle-hover-card-content>
      <p class="text-sm">Card appears right</p>
    </tolle-hover-card-content>
  </tolle-hover-card>
</div>
```

## Use Cases

### User Profile Card

```html
<tolle-hover-card>
  <tolle-hover-card-trigger>
    <div
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted">
      <tolle-avatar size="sm">
        <img src="https://github.com/shadcn.png" />
      </tolle-avatar>
      <span class="text-sm font-medium">shadcn</span>
    </div>
  </tolle-hover-card-trigger>
  <tolle-hover-card-content class="w-80">
    <div class="flex space-x-4">
      <tolle-avatar size="lg">
        <img src="https://github.com/shadcn.png" />
      </tolle-avatar>
      <div class="space-y-1">
        <h4 class="text-sm font-semibold">shadcn</h4>
        <p class="text-xs text-muted-foreground">@shadcn</p>
        <p class="pt-2 text-sm">Building UI components. Creator of shadcn/ui.</p>
        <div class="flex items-center pt-2 text-xs text-muted-foreground">
          <i class="ri-map-pin-line mr-1"></i>
          San Francisco
          <i class="ri-calendar-line ml-3 mr-1"></i>
          Joined March 2021
        </div>
      </div>
    </div>
    <div class="mt-3 flex justify-between border-t pt-3">
      <div class="text-center">
        <div class="text-sm font-semibold">2.5k</div>
        <div class="text-xs text-muted-foreground">Followers</div>
      </div>
      <div class="text-center">
        <div class="text-sm font-semibold">156</div>
        <div class="text-xs text-muted-foreground">Following</div>
      </div>
      <div class="text-center">
        <div class="text-sm font-semibold">89</div>
        <div class="text-xs text-muted-foreground">Repos</div>
      </div>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>
```

### Link Preview Card

```html
<tolle-hover-card>
  <tolle-hover-card-trigger>
    <a href="/docs/components" class="text-primary hover:underline"> Components Documentation </a>
  </tolle-hover-card-trigger>
  <tolle-hover-card-content class="w-80">
    <div class="space-y-2">
      <h4 class="text-sm font-semibold">Components Overview</h4>
      <p class="text-sm text-muted-foreground">
        Learn about all available components in the library. Including buttons, forms, dialogs, and
        more.
      </p>
      <div class="flex items-center text-xs text-muted-foreground">
        <i class="ri-file-line mr-1"></i>
        docs/components.md
        <i class="ri-time-line ml-3 mr-1"></i>
        Updated 2 days ago
      </div>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>
```

### Product Card Preview

```html
<tolle-hover-card openDelay="300" closeDelay="200">
  <tolle-hover-card-trigger>
    <div
      class="flex cursor-pointer items-center gap-3 rounded-lg border p-2 transition-colors hover:border-primary">
      <img
        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop"
        class="h-12 w-12 rounded object-cover"
        alt="Product" />
      <div>
        <div class="text-sm font-medium">Smart Watch</div>
        <div class="text-xs text-muted-foreground">$299.00</div>
      </div>
    </div>
  </tolle-hover-card-trigger>
  <tolle-hover-card-content class="w-72">
    <div class="space-y-3">
      <img
        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop"
        class="h-32 w-full rounded object-cover"
        alt="Product" />
      <div>
        <h4 class="text-sm font-semibold">Smart Watch Pro</h4>
        <div class="mt-1 flex items-center gap-1">
          <div class="flex">
            <i class="ri-star-fill text-sm text-yellow-400"></i>
            <i class="ri-star-fill text-sm text-yellow-400"></i>
            <i class="ri-star-fill text-sm text-yellow-400"></i>
            <i class="ri-star-fill text-sm text-yellow-400"></i>
            <i class="ri-star-half-fill text-sm text-yellow-400"></i>
          </div>
          <span class="text-xs text-muted-foreground">(4.5)</span>
        </div>
        <div class="mt-2 text-lg font-bold">$299.00</div>
        <div class="text-xs text-muted-foreground line-through">$349.00</div>
      </div>
      <div class="flex gap-2">
        <tolle-button size="sm" class="flex-1">Add to Cart</tolle-button>
        <tolle-button size="sm" variant="outline">
          <i class="ri-heart-line"></i>
        </tolle-button>
      </div>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>
```

### Repository Info

```html
<tolle-hover-card openDelay="500">
  <tolle-hover-card-trigger>
    <a href="#" class="font-mono text-sm font-medium text-primary hover:underline">
      tolle-ui/components
    </a>
  </tolle-hover-card-trigger>
  <tolle-hover-card-content class="w-80">
    <div class="space-y-3">
      <div class="flex items-start gap-3">
        <div class="rounded bg-muted p-2">
          <i class="ri-code-s-slash-line text-xl"></i>
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-semibold">tolle-ui/components</h4>
          <p class="mt-1 text-xs text-muted-foreground">
            A collection of beautifully designed Angular components
          </p>
        </div>
      </div>
      <div class="flex items-center gap-4 text-xs text-muted-foreground">
        <span class="flex items-center gap-1">
          <i class="ri-star-line"></i>
          12.5k
        </span>
        <span class="flex items-center gap-1">
          <i class="ri-git-fork-line"></i>
          523
        </span>
        <span class="flex items-center gap-1">
          <i class="ri-eye-line"></i>
          198
        </span>
      </div>
      <div class="flex gap-2">
        <span class="rounded-full bg-muted px-2 py-0.5 text-xs">typescript</span>
        <span class="rounded-full bg-muted px-2 py-0.5 text-xs">angular</span>
        <span class="rounded-full bg-muted px-2 py-0.5 text-xs">ui</span>
      </div>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>
```

### Article Preview

```html
<tolle-hover-card placement="right" openDelay="400">
  <tolle-hover-card-trigger>
    <a href="#" class="text-primary hover:underline"> Getting Started with Angular </a>
  </tolle-hover-card-trigger>
  <tolle-hover-card-content class="w-80">
    <div class="space-y-2">
      <div class="text-xs text-muted-foreground">Tutorial · 8 min read</div>
      <h4 class="text-sm font-semibold">Getting Started with Angular: A Complete Guide</h4>
      <p class="text-sm text-muted-foreground">
        Learn the fundamentals of Angular and build your first application from scratch.
      </p>
      <div class="flex items-center gap-2 pt-2">
        <tolle-avatar size="sm">
          <img src="https://github.com/shadcn.png" />
        </tolle-avatar>
        <div>
          <div class="text-xs font-medium">John Doe</div>
          <div class="text-xs text-muted-foreground">Mar 15, 2024</div>
        </div>
      </div>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>
```

### Quick Actions Card

```html
<tolle-hover-card>
  <tolle-hover-card-trigger>
    <div class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-muted">
      <i class="ri-file-line"></i>
      <span class="text-sm">Project_Document.pdf</span>
    </div>
  </tolle-hover-card-trigger>
  <tolle-hover-card-content class="w-64">
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <i class="ri-file-line text-xl text-muted-foreground"></i>
        <div>
          <div class="text-sm font-medium">Project_Document.pdf</div>
          <div class="text-xs text-muted-foreground">2.4 MB · PDF</div>
        </div>
      </div>
      <div class="flex gap-2 pt-2">
        <tolle-button size="sm" variant="outline" class="flex-1">
          <i class="ri-eye-line mr-1"></i>View
        </tolle-button>
        <tolle-button size="sm" variant="outline" class="flex-1">
          <i class="ri-download-line mr-1"></i>Download
        </tolle-button>
      </div>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>
```

### Contact Card

```html
<tolle-hover-card>
  <tolle-hover-card-trigger>
    <div class="flex cursor-pointer items-center gap-3">
      <tolle-avatar>
        <img src="https://github.com/shadcn.png" />
      </tolle-avatar>
      <div>
        <div class="text-sm font-medium">John Doe</div>
        <div class="text-xs text-muted-foreground">john@example.com</div>
      </div>
    </div>
  </tolle-hover-card-trigger>
  <tolle-hover-card-content class="w-72">
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <tolle-avatar size="lg">
          <img src="https://github.com/shadcn.png" />
        </tolle-avatar>
        <div>
          <div class="text-sm font-semibold">John Doe</div>
          <div class="text-xs text-muted-foreground">Software Engineer</div>
        </div>
      </div>
      <div class="space-y-1 text-xs">
        <div class="flex items-center gap-2">
          <i class="ri-mail-line text-muted-foreground"></i>
          john@example.com
        </div>
        <div class="flex items-center gap-2">
          <i class="ri-phone-line text-muted-foreground"></i>
          +1 (555) 123-4567
        </div>
        <div class="flex items-center gap-2">
          <i class="ri-map-pin-line text-muted-foreground"></i>
          San Francisco, CA
        </div>
      </div>
      <div class="flex gap-2 pt-2">
        <tolle-button size="sm" variant="outline" class="flex-1">
          <i class="ri-mail-line mr-1"></i>Email
        </tolle-button>
        <tolle-button size="sm" variant="outline" class="flex-1">
          <i class="ri-phone-line mr-1"></i>Call
        </tolle-button>
      </div>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>
```

### Custom Delay

```html
<!-- Instant hover (no delay) -->
<tolle-hover-card [openDelay]="0" [closeDelay]="100">
  <tolle-hover-card-trigger>
    <tolle-button variant="ghost">Quick Preview</tolle-button>
  </tolle-hover-card-trigger>
  <tolle-hover-card-content>
    <p class="text-sm">Appears instantly</p>
  </tolle-hover-card-content>
</tolle-hover-card>

<!-- Slow hover (long delay) -->
<tolle-hover-card [openDelay]="1000" [closeDelay]="500">
  <tolle-hover-card-trigger>
    <tolle-button variant="ghost">Detailed Card</tolle-button>
  </tolle-hover-card-trigger>
  <tolle-hover-card-content>
    <p class="text-sm">Takes 1 second to appear</p>
  </tolle-hover-card-content>
</tolle-hover-card>
```

## Accessibility

- **Mouse Users**: Hover over the trigger element to show the card, move away to hide it.
- **Keyboard Users**: Focus on the trigger element to show the card, blur or Tab away to hide it.
- **Screen Readers**: The hover card content is accessible when the trigger receives focus.
