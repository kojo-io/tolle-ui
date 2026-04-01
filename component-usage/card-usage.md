# Card Component Usage Guide

## Overview

The Card component is a versatile container for displaying related content like text, images, and actions. It provides a structured layout with header, content, and footer sections that can be combined and customized for various use cases.

## Import

```typescript
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
  CardFooterComponent,
} from '@tolle_/tolle-ui';
```

## Components

### CardComponent

Container component with default border, rounded corners, and shadow.

**Selector:** `tolle-card`

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

**Default Classes:** `rounded-md border border-border text-card-foreground shadow`

### CardHeaderComponent

Header section with padding and flex column layout.

**Selector:** `tolle-card-header`

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

**Default Classes:** `flex flex-col space-y-1.5 p-6`

### CardTitleComponent

Title element with semi-bold font.

**Selector:** `tolle-card-title`

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

**Default Classes:** `font-semibold leading-none tracking-tight`

### CardContentComponent

Main content area with padding.

**Selector:** `tolle-card-content`

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

**Default Classes:** `p-6 pt-0`

### CardFooterComponent

Footer section with horizontal flex layout.

**Selector:** `tolle-card-footer`

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

**Default Classes:** `flex items-center p-6 pt-0`

## Basic Usage

### Basic Card

```html
<tolle-card class="w-[350px]">
  <tolle-card-header>
    <tolle-card-title>Card Title</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content>
    <p class="text-sm text-muted-foreground">This is a basic card with a title and content area.</p>
  </tolle-card-content>
</tolle-card>
```

### Card with Header and Footer

```html
<tolle-card class="w-[400px]">
  <tolle-card-header>
    <tolle-card-title>Project Details</tolle-card-title>
    <p class="text-sm text-muted-foreground">Manage your project settings and configuration.</p>
  </tolle-card-header>
  <tolle-card-content>
    <p>Card content goes here. This can be any content like forms, lists, or text.</p>
  </tolle-card-content>
  <tolle-card-footer class="flex justify-end gap-2">
    <tolle-button variant="outline">Cancel</tolle-button>
    <tolle-button>Save</tolle-button>
  </tolle-card-footer>
</tolle-card>
```

### Card with Description

Use a paragraph inside the header for descriptions:

```html
<tolle-card class="w-[400px]">
  <tolle-card-header>
    <tolle-card-title>Create Project</tolle-card-title>
    <p class="text-sm text-muted-foreground">Deploy your new project in one click.</p>
  </tolle-card-header>
  <tolle-card-content>
    <tolle-input label="Project Name" placeholder="Enter project name"></tolle-input>
    <tolle-input label="Description" placeholder="Enter description" class="mt-4"></tolle-input>
  </tolle-card-content>
  <tolle-card-footer>
    <tolle-button>Create Project</tolle-button>
  </tolle-card-footer>
</tolle-card>
```

## Use Cases

### Form Card

```html
<tolle-card class="w-md">
  <tolle-card-header>
    <tolle-card-title class="flex items-center gap-2">
      <i class="ri-palette-line text-primary"></i>
      Theme Settings
    </tolle-card-title>
    <p class="text-sm text-muted-foreground">Customize your application appearance.</p>
  </tolle-card-header>

  <tolle-card-content class="space-y-4">
    <div class="space-y-2">
      <tolle-label>Primary Color</tolle-label>
      <tolle-input placeholder="#2563eb">
        <i prefix class="ri-drop-line"></i>
      </tolle-input>
    </div>

    <div class="space-y-2">
      <tolle-label>Radius</tolle-label>
      <tolle-select placeholder="Select radius">
        <tolle-select-item value="sm">Small</tolle-select-item>
        <tolle-select-item value="md">Medium</tolle-select-item>
        <tolle-select-item value="lg">Large</tolle-select-item>
      </tolle-select>
    </div>
  </tolle-card-content>

  <tolle-card-footer class="flex justify-between">
    <tolle-button variant="ghost">Reset</tolle-button>
    <tolle-button>Save Changes</tolle-button>
  </tolle-card-footer>
</tolle-card>
```

### User Profile Card

```html
<tolle-card class="w-[350px]">
  <tolle-card-content>
    <div class="flex items-center gap-4">
      <tolle-avatar class="h-16 w-16">
        <img src="https://github.com/shadcn.png" alt="User" />
      </tolle-avatar>
      <div class="flex-1">
        <h3 class="font-semibold">John Doe</h3>
        <p class="text-sm text-muted-foreground">john@example.com</p>
        <p class="mt-1 text-xs text-muted-foreground">Software Engineer</p>
      </div>
    </div>
  </tolle-card-content>
  <tolle-card-footer class="border-t pt-4">
    <tolle-button variant="outline" class="flex-1">Message</tolle-button>
    <tolle-button class="ml-2 flex-1">Follow</tolle-button>
  </tolle-card-footer>
</tolle-card>
```

### Product Card

```html
<tolle-card class="w-[300px] overflow-hidden">
  <img
    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=250&fit=crop"
    alt="Product"
    class="h-40 w-full object-cover" />
  <tolle-card-header>
    <tolle-card-title>Smart Watch</tolle-card-title>
    <p class="text-sm text-muted-foreground">Premium smartwatch with health tracking</p>
  </tolle-card-header>
  <tolle-card-content>
    <div class="flex items-center justify-between">
      <div>
        <span class="text-lg font-bold">$299</span>
        <span class="ml-2 text-sm text-muted-foreground line-through">$349</span>
      </div>
      <tolle-badge variant="secondary">15% OFF</tolle-badge>
    </div>
    <div class="mt-2 flex items-center gap-1">
      <i class="ri-star-fill text-yellow-400"></i>
      <i class="ri-star-fill text-yellow-400"></i>
      <i class="ri-star-fill text-yellow-400"></i>
      <i class="ri-star-fill text-yellow-400"></i>
      <i class="ri-star-line text-muted-foreground"></i>
      <span class="ml-1 text-sm text-muted-foreground">(4.0)</span>
    </div>
  </tolle-card-content>
  <tolle-card-footer>
    <tolle-button class="w-full">Add to Cart</tolle-button>
  </tolle-card-footer>
</tolle-card>
```

### Notification Card

```html
<tolle-card class="w-[400px]">
  <tolle-card-header>
    <tolle-card-title>Notifications</tolle-card-title>
    <tolle-badge variant="secondary">3 new</tolle-badge>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <div class="flex items-start gap-4">
      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
        <i class="ri-message-line text-blue-600"></i>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">New message from Sarah</p>
        <p class="text-xs text-muted-foreground">2 minutes ago</p>
      </div>
    </div>
    <div class="flex items-start gap-4">
      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
        <i class="ri-check-line text-green-600"></i>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">Payment successful</p>
        <p class="text-xs text-muted-foreground">1 hour ago</p>
      </div>
    </div>
    <div class="flex items-start gap-4">
      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
        <i class="ri-calendar-line text-orange-600"></i>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">Meeting reminder</p>
        <p class="text-xs text-muted-foreground">Tomorrow at 10:00 AM</p>
      </div>
    </div>
  </tolle-card-content>
  <tolle-card-footer class="justify-center">
    <tolle-button variant="ghost" size="sm">Mark all as read</tolle-button>
  </tolle-card-footer>
</tolle-card>
```

### Statistics Card

```html
<tolle-card class="w-[300px]">
  <tolle-card-header>
    <tolle-card-title>Monthly Revenue</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content>
    <div class="flex items-baseline gap-2">
      <span class="text-3xl font-bold">$45,231</span>
      <span class="text-sm text-green-600">+20.1%</span>
    </div>
    <p class="mt-1 text-sm text-muted-foreground">from last month</p>

    <!-- Simple chart representation -->
    <div class="mt-4 flex h-16 items-end gap-1">
      <div class="flex-1 rounded-sm bg-muted" style="height: 40%"></div>
      <div class="flex-1 rounded-sm bg-muted" style="height: 55%"></div>
      <div class="flex-1 rounded-sm bg-muted" style="height: 45%"></div>
      <div class="flex-1 rounded-sm bg-muted" style="height: 65%"></div>
      <div class="flex-1 rounded-sm bg-muted" style="height: 70%"></div>
      <div class="flex-1 rounded-sm bg-muted" style="height: 55%"></div>
      <div class="flex-1 rounded-sm bg-primary" style="height: 85%"></div>
    </div>
  </tolle-card-content>
</tolle-card>
```

### Settings Card

```html
<tolle-card class="w-[400px]">
  <tolle-card-header>
    <tolle-card-title>Email Notifications</tolle-card-title>
    <p class="text-sm text-muted-foreground">Manage your email notification preferences.</p>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium">Marketing emails</p>
        <p class="text-sm text-muted-foreground">Receive emails about new products</p>
      </div>
      <tolle-switch></tolle-switch>
    </div>
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium">Security alerts</p>
        <p class="text-sm text-muted-foreground">Get notified about security issues</p>
      </div>
      <tolle-switch></tolle-switch>
    </div>
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium">Weekly digest</p>
        <p class="text-sm text-muted-foreground">Receive a weekly summary</p>
      </div>
      <tolle-switch></tolle-switch>
    </div>
  </tolle-card-content>
</tolle-card>
```

### Team Members Card

```html
<tolle-card class="w-[400px]">
  <tolle-card-header>
    <tolle-card-title>Team Members</tolle-card-title>
    <tolle-button variant="outline" size="sm">Invite</tolle-button>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <tolle-avatar class="h-10 w-10">
          <img src="https://github.com/shadcn.png" />
        </tolle-avatar>
        <div>
          <p class="font-medium">John Doe</p>
          <p class="text-xs text-muted-foreground">john@example.com</p>
        </div>
      </div>
      <tolle-badge>Owner</tolle-badge>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <tolle-avatar class="h-10 w-10">
          <img src="https://github.com/vercel.png" />
        </tolle-avatar>
        <div>
          <p class="font-medium">Jane Smith</p>
          <p class="text-xs text-muted-foreground">jane@example.com</p>
        </div>
      </div>
      <tolle-badge variant="outline">Admin</tolle-badge>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <tolle-avatar class="h-10 w-10">
          <img src="https://github.com/github.png" />
        </tolle-avatar>
        <div>
          <p class="font-medium">Bob Wilson</p>
          <p class="text-xs text-muted-foreground">bob@example.com</p>
        </div>
      </div>
      <tolle-badge variant="secondary">Member</tolle-badge>
    </div>
  </tolle-card-content>
</tolle-card>
```

### Card Grid

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  @for (item of items; track item.id) {
  <tolle-card>
    <tolle-card-header>
      <img [src]="item.image" alt="" class="-m-6 mb-4 h-32 w-full rounded-t-md object-cover" />
      <tolle-card-title>{{ item.title }}</tolle-card-title>
      <p class="text-sm text-muted-foreground">{{ item.description }}</p>
    </tolle-card-header>
    <tolle-card-content>
      <div class="flex items-center justify-between">
        <span class="font-semibold">{{ item.price }}</span>
        <div class="flex items-center gap-1">
          <i class="ri-star-fill text-yellow-400"></i>
          <span class="text-sm">{{ item.rating }}</span>
        </div>
      </div>
    </tolle-card-content>
  </tolle-card>
  }
</div>
```

### Login Card

```html
<tolle-card class="mx-auto w-[400px]">
  <tolle-card-header class="text-center">
    <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
      <i class="ri-lock-line text-xl text-primary"></i>
    </div>
    <tolle-card-title>Welcome back</tolle-card-title>
    <p class="text-sm text-muted-foreground">Enter your credentials to sign in</p>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <tolle-input label="Email" type="email" placeholder="name@example.com">
      <i prefix class="ri-mail-line"></i>
    </tolle-input>
    <tolle-input label="Password" type="password" placeholder="Enter password">
      <i prefix class="ri-lock-line"></i>
    </tolle-input>
    <div class="flex items-center justify-between">
      <label class="flex items-center gap-2">
        <tolle-checkbox></tolle-checkbox>
        <span class="text-sm">Remember me</span>
      </label>
      <a href="#" class="text-sm text-primary hover:underline">Forgot password?</a>
    </div>
  </tolle-card-content>
  <tolle-card-footer class="flex-col gap-4">
    <tolle-button class="w-full">Sign In</tolle-button>
    <p class="text-sm text-muted-foreground">
      Don't have an account? <a href="#" class="text-primary hover:underline">Sign up</a>
    </p>
  </tolle-card-footer>
</tolle-card>
```

### Image Card with Overlay

```html
<tolle-card class="group relative w-[350px] overflow-hidden">
  <img
    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df5?w=400&h=250&fit=crop"
    alt="Mountain"
    class="h-48 w-full object-cover" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
  <tolle-card-header class="absolute bottom-0 left-0 right-0 text-white">
    <tolle-card-title>Adventure Travel</tolle-card-title>
    <p class="text-sm opacity-80">Explore the world's most beautiful destinations</p>
  </tolle-card-header>
  <tolle-card-footer
    class="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
    <tolle-button size="sm" variant="secondary">
      <i class="ri-heart-line mr-1"></i> Save
    </tolle-button>
  </tolle-card-footer>
</tolle-card>
```

### Interactive Card

```html
<tolle-card class="w-[350px] cursor-pointer transition-shadow hover:shadow-lg">
  <tolle-card-content class="pt-6">
    <div class="flex items-start gap-4">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
        <i class="ri-code-line text-xl text-blue-600"></i>
      </div>
      <div>
        <h3 class="font-semibold">API Integration</h3>
        <p class="mt-1 text-sm text-muted-foreground">
          Easily integrate with our REST API. Get started in minutes.
        </p>
        <div class="mt-3 flex items-center gap-2">
          <tolle-badge variant="outline">REST</tolle-badge>
          <tolle-badge variant="outline">GraphQL</tolle-badge>
        </div>
      </div>
    </div>
  </tolle-card-content>
  <tolle-card-footer>
    <tolle-button variant="ghost" size="sm">
      Learn more <i class="ri-arrow-right-line ml-1"></i>
    </tolle-button>
  </tolle-card-footer>
</tolle-card>
```

### Pricing Card

```html
<tolle-card class="w-[350px] border-primary">
  <tolle-card-header>
    <tolle-badge class="mb-2">Most Popular</tolle-badge>
    <tolle-card-title>Pro Plan</tolle-card-title>
    <div class="mt-2">
      <span class="text-4xl font-bold">$29</span>
      <span class="text-muted-foreground">/month</span>
    </div>
  </tolle-card-header>
  <tolle-card-content>
    <ul class="space-y-3">
      <li class="flex items-center gap-2">
        <i class="ri-check-line text-primary"></i>
        <span>Unlimited projects</span>
      </li>
      <li class="flex items-center gap-2">
        <i class="ri-check-line text-primary"></i>
        <span>Priority support</span>
      </li>
      <li class="flex items-center gap-2">
        <i class="ri-check-line text-primary"></i>
        <span>Advanced analytics</span>
      </li>
      <li class="flex items-center gap-2">
        <i class="ri-check-line text-primary"></i>
        <span>Custom domains</span>
      </li>
      <li class="flex items-center gap-2 text-muted-foreground">
        <i class="ri-close-line"></i>
        <span>SSO integration</span>
      </li>
    </ul>
  </tolle-card-content>
  <tolle-card-footer>
    <tolle-button class="w-full">Get Started</tolle-button>
  </tolle-card-footer>
</tolle-card>
```

### Comparison Card

```html
<div class="flex gap-4">
  <tolle-card class="flex-1">
    <tolle-card-header class="text-center">
      <tolle-card-title>Free</tolle-card-title>
      <div class="mt-2 text-3xl font-bold">$0</div>
      <p class="text-sm text-muted-foreground">For personal projects</p>
    </tolle-card-header>
    <tolle-card-content>
      <ul class="space-y-2 text-sm">
        <li class="flex items-center gap-2">
          <i class="ri-check-line text-green-500"></i>1 project
        </li>
        <li class="flex items-center gap-2">
          <i class="ri-check-line text-green-500"></i>Basic support
        </li>
        <li class="flex items-center gap-2">
          <i class="ri-close-line text-muted-foreground"></i>Custom domain
        </li>
      </ul>
    </tolle-card-content>
    <tolle-card-footer>
      <tolle-button variant="outline" class="w-full">Get Started</tolle-button>
    </tolle-card-footer>
  </tolle-card>

  <tolle-card class="flex-1 border-primary">
    <tolle-card-header class="text-center">
      <tolle-card-title>Pro</tolle-card-title>
      <div class="mt-2 text-3xl font-bold">$29</div>
      <p class="text-sm text-muted-foreground">For growing teams</p>
    </tolle-card-header>
    <tolle-card-content>
      <ul class="space-y-2 text-sm">
        <li class="flex items-center gap-2">
          <i class="ri-check-line text-green-500"></i>Unlimited projects
        </li>
        <li class="flex items-center gap-2">
          <i class="ri-check-line text-green-500"></i>Priority support
        </li>
        <li class="flex items-center gap-2">
          <i class="ri-check-line text-green-500"></i>Custom domain
        </li>
      </ul>
    </tolle-card-content>
    <tolle-card-footer>
      <tolle-button class="w-full">Get Started</tolle-button>
    </tolle-card-footer>
  </tolle-card>
</div>
```

## Custom Styling

### Hover Effect

```html
<tolle-card class="w-[350px] cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg">
  <tolle-card-header>
    <tolle-card-title>Interactive Card</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content>
    <p>Hover over this card to see the effect.</p>
  </tolle-card-content>
</tolle-card>
```

### Borderless Card

```html
<tolle-card class="border-0 shadow-none">
  <tolle-card-header>
    <tolle-card-title>Borderless Card</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content>
    <p>This card has no border or shadow.</p>
  </tolle-card-content>
</tolle-card>
```

### Compact Card

```html
<tolle-card class="w-[300px]">
  <tolle-card-header class="p-4">
    <tolle-card-title class="text-base">Compact Card</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="p-4 pt-0">
    <p class="text-sm">Reduced padding for a more compact look.</p>
  </tolle-card-content>
</tolle-card>
```

### Destructive Card

```html
<tolle-card class="border-destructive/50 bg-destructive/5">
  <tolle-card-header>
    <tolle-card-title class="flex items-center gap-2 text-destructive">
      <i class="ri-error-warning-line"></i>
      Error
    </tolle-card-title>
  </tolle-card-header>
  <tolle-card-content>
    <p class="text-sm">Something went wrong. Please try again.</p>
  </tolle-card-content>
  <tolle-card-footer>
    <tolle-button variant="destructive" size="sm">Retry</tolle-button>
  </tolle-card-footer>
</tolle-card>
```

## Accessibility

- Use semantic HTML (`<h3>` for titles within cards)
- Ensure sufficient contrast for text content
- Interactive cards should use appropriate ARIA attributes
- Cards are not inherently focusable - add `tabindex` and interactive handlers if needed
