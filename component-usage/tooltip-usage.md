# Tooltip Directive Usage Guide

## Overview

The TooltipDirective provides a lightweight tooltip that displays additional information when hovering over or focusing on an element. It supports multiple positions, custom triggers, and rich content via templates.

## Import

```typescript
import { TooltipDirective } from '@tolle_/tolle-ui';
```

## TooltipDirective

**Inputs:**

| Input                  | Type                                     | Default        | Description                        |
| ---------------------- | ---------------------------------------- | -------------- | ---------------------------------- |
| `tolleTooltip`         | `string \| TemplateRef`                  | `''`           | Tooltip content (text or template) |
| `tolleTooltipTrigger`  | `'mouseenter' \| 'click' \| 'focus'`     | `'mouseenter'` | Trigger event                      |
| `tolleTooltipPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'`        | Tooltip position                   |
| `tolleTooltipDelay`    | `number`                                 | `0`            | Delay before showing (ms)          |

## Basic Usage

### Simple Tooltip

```html
<div class="flex flex-wrap items-center justify-center gap-4 p-8">
  <tolle-button variant="outline" tolleTooltip="Tooltip on top"> Top </tolle-button>

  <tolle-button variant="outline" tolleTooltip="Tooltip on bottom" tolleTooltipPosition="bottom">
    Bottom
  </tolle-button>

  <tolle-button variant="outline" tolleTooltip="Tooltip on left" tolleTooltipPosition="left">
    Left
  </tolle-button>

  <tolle-button variant="outline" tolleTooltip="Tooltip on right" tolleTooltipPosition="right">
    Right
  </tolle-button>
</div>
```

### All Placements

```html
<div class="grid grid-cols-3 gap-4 p-8">
  <div></div>
  <tolle-button tolleTooltip="Top tooltip" tolleTooltipPosition="top">Top</tolle-button>
  <div></div>

  <tolle-button tolleTooltip="Left tooltip" tolleTooltipPosition="left">Left</tolle-button>
  <div class="flex items-center justify-center rounded-lg border p-8">Target</div>
  <tolle-button tolleTooltip="Right tooltip" tolleTooltipPosition="right">Right</tolle-button>

  <div></div>
  <tolle-button tolleTooltip="Bottom tooltip" tolleTooltipPosition="bottom">Bottom</tolle-button>
  <div></div>
</div>
```

## Triggers

### Mouse Enter (Default)

```html
<tolle-button tolleTooltip="Hover to see this tooltip"> Hover Me </tolle-button>
```

### Click Trigger

```html
<tolle-button
  variant="outline"
  tolleTooltip="Click to show, click elsewhere to hide"
  tolleTooltipTrigger="click">
  Click Me
</tolle-button>
```

### Focus Trigger

Useful for form inputs and accessibility:

```html
<tolte-input
  label="Username"
  placeholder="Enter username"
  tolleTooltip="Username must be 3-20 characters"
  tolleTooltipPosition="right"
  tolleTooltipTrigger="focus">
</tolle-input>

<tolle-input
  type="password"
  label="Password"
  placeholder="Enter password"
  tolleTooltip="Must contain 8+ characters, 1 uppercase, 1 number"
  tolleTooltipPosition="bottom"
  tolleTooltipTrigger="focus">
</tolle-input>
```

### Combined Trigger (Focus + Hover)

For accessibility, use focus trigger on interactive elements:

```html
<tolle-button tolleTooltip="Press Tab or hover to see this" tolleTooltipTrigger="focus">
  Accessible Button
</tolle-button>

<a href="#" tolleTooltip="Learn more about our services" tolleTooltipPosition="top"> Learn More </a>
```

## Delay

### No Delay (Default)

```html
<tolle-button tolleTooltip="Appears instantly"> Instant </tolle-button>
```

### Custom Delay

```html
<!-- 500ms delay -->
<tolle-button tolleTooltip="Takes 500ms to appear" [tolleTooltipDelay]="500">
  Delayed Tooltip
</tolle-button>

<!-- 1 second delay -->
<tolle-button tolleTooltip="Takes 1 second to appear" [tolleTooltipDelay]="1000">
  Long Delay
</tolle-button>
```

## Use Cases

### Icon Buttons

```html
<div class="flex gap-2">
  <tolle-button size="icon" variant="ghost" tolleTooltip="Edit" tolleTooltipPosition="bottom">
    <i class="ri-edit-line"></i>
  </tolle-button>

  <tolle-button size="icon" variant="ghost" tolleTooltip="Copy" tolleTooltipPosition="bottom">
    <i class="ri-file-copy-line"></i>
  </tolle-button>

  <tolle-button size="icon" variant="ghost" tolleTooltip="Delete" tolleTooltipPosition="bottom">
    <i class="ri-delete-bin-line"></i>
  </tolle-button>

  <tolle-button
    size="icon"
    variant="ghost"
    tolleTooltip="More options"
    tolleTooltipPosition="bottom">
    <i class="ri-more-2-fill"></i>
  </tolle-button>
</div>
```

### Form Fields with Help

```html
<div class="space-y-4">
  <div class="flex items-center gap-2">
    <tolle-input label="API Key" placeholder="Enter your API key" class="flex-1"> </tolle-input>
    <tolle-button
      size="icon"
      variant="ghost"
      tolleTooltip="Find your API key in Settings > API Keys"
      tolleTooltipPosition="top">
      <i class="ri-question-line"></i>
    </tolle-button>
  </div>

  <div class="flex items-center gap-2">
    <tolle-input
      id="password"
      type="password"
      label="Password"
      placeholder="Enter password"
      tolleTooltip="8+ chars, 1 uppercase, 1 number"
      tolleTooltipPosition="right"
      tolleTooltipTrigger="focus">
    </tolle-input>
  </div>
</div>
```

### Navigation Links

```html
<div class="flex gap-1">
  <a
    routerLink="/dashboard"
    class="rounded-md p-2 hover:bg-muted"
    tolleTooltip="Dashboard"
    tolleTooltipPosition="bottom">
    <i class="ri-dashboard-line"></i>
  </a>

  <a
    routerLink="/settings"
    class="rounded-md p-2 hover:bg-muted"
    tolleTooltip="Settings"
    tolleTooltipPosition="bottom">
    <i class="ri-settings-line"></i>
  </a>

  <a
    routerLink="/profile"
    class="rounded-md p-2 hover:bg-muted"
    tolleTooltip="Profile"
    tolleTooltipPosition="bottom">
    <i class="ri-user-line"></i>
  </a>

  <a
    routerLink="/logout"
    class="rounded-md p-2 hover:bg-muted"
    tolleTooltip="Sign out"
    tolleTooltipPosition="bottom">
    <i class="ri-logout-box-line"></i>
  </a>
</div>
```

### Status Indicators

```html
<div class="flex items-center gap-4">
  <div
    class="h-3 w-3 cursor-pointer rounded-full bg-green-500"
    tolleTooltip="All systems operational"
    tolleTooltipPosition="top"></div>

  <div
    class="h-3 w-3 cursor-pointer rounded-full bg-yellow-500"
    tolleTooltip="Performance degraded"
    tolleTooltipPosition="top"></div>

  <div
    class="h-3 w-3 cursor-pointer rounded-full bg-red-500"
    tolleTooltip="System offline"
    tolleTooltipPosition="top"></div>
</div>
```

### Toolbar Buttons

```html
<div class="flex items-center gap-1 rounded-lg border p-2">
  <tolle-button size="icon" variant="ghost" tolleTooltip="Bold (Ctrl+B)">
    <i class="ri-bold"></i>
  </tolle-button>
  <tolle-button size="icon" variant="ghost" tolleTooltip="Italic (Ctrl+I)">
    <i class="ri-italic"></i>
  </tolle-button>
  <tolle-button size="icon" variant="ghost" tolleTooltip="Underline (Ctrl+U)">
    <i class="ri-underline"></i>
  </tolle-button>

  <div class="mx-1 h-4 w-px bg-border"></div>

  <tolle-button size="icon" variant="ghost" tolleTooltip="Align Left">
    <i class="ri-align-left"></i>
  </tolle-button>
  <tolle-button size="icon" variant="ghost" tolleTooltip="Align Center">
    <i class="ri-align-center"></i>
  </tolle-button>
  <tolle-button size="icon" variant="ghost" tolleTooltip="Align Right">
    <i class="ri-align-right"></i>
  </tolle-button>

  <div class="mx-1 h-4 w-px bg-border"></div>

  <tolle-button size="icon" variant="ghost" tolleTooltip="Link">
    <i class="ri-link"></i>
  </tolle-button>
  <tolle-button size="icon" variant="ghost" tolleTooltip="Image">
    <i class="ri-image-line"></i>
  </tolle-button>
</div>
```

### Truncated Text

```html
<!-- Show full text in tooltip when truncated -->
<div
  class="max-w-[200px] cursor-pointer truncate"
  tolleTooltip="This is a very long text that gets truncated and shows in tooltip"
  tolleTooltipPosition="top">
  This is a very long text that gets truncated and shows in tooltip
</div>
```

### Keyboard Shortcuts

```html
<tolle-button variant="outline" tolleTooltip="Save (Ctrl+S)"> Save </tolle-button>

<tolle-button variant="outline" tolleTooltip="Open (Ctrl+O)"> Open </tolle-button>

<tolle-button variant="outline" tolleTooltip="Find (Ctrl+F)"> Find </tolle-button>
```

### Error States

```html
<div class="space-y-2">
  <tolle-input
    label="Email"
    placeholder="Enter email"
    [error]="!isValidEmail"
    errorMessage="Invalid email format"
    tolleTooltip="Enter a valid email address"
    tolleTooltipPosition="right"
    tolleTooltipTrigger="focus">
  </tolle-input>

  <tolle-input
    id="password"
    type="password"
    label="Password"
    placeholder="Enter password"
    [error]="!isValidPassword"
    errorMessage="Password is too weak"
    tolleTooltip="Must be 8+ chars with uppercase and number"
    tolleTooltipPosition="right"
    tolleTooltipTrigger="focus">
  </tolle-input>
</div>
```

### Badge with Tooltip

```html
<div class="flex items-center gap-2">
  <tolle-badge variant="outline" tolleTooltip="Requires Premium subscription">
    <i class="ri-vip-crown-line mr-1"></i>
    Pro
  </tolle-badge>

  <tolle-badge variant="destructive" tolleTooltip="Expires in 3 days"> Expiring </tolle-badge>

  <tolle-badge variant="success" tolleTooltip="Verification completed">
    <i class="ri-check-line mr-1"></i>
    Verified
  </tolle-badge>
</div>
```

### Conditional Tooltip

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `
    <tolle-button
      [tolleTooltip]="isDisabled ? 'Feature requires upgrade' : ''"
      [disabled]="isDisabled">
      {{ isDisabled ? 'Upgrade Required' : 'Use Feature' }}
    </tolle-button>
  `,
})
export class ExampleComponent {
  isDisabled = true;
}
```

## Accessibility

- **Keyboard**: Focus on elements to show tooltip (when using `focus` trigger)
- **Screen Readers**: Add `aria-label` to elements that use click trigger
- **Mobile**: Click trigger is recommended for touch devices

### Recommended Pattern for Icons

```html
<!-- For icon-only buttons, always include visible text or aria-label -->
<tolle-button size="icon" variant="ghost" aria-label="Edit item" tolleTooltip="Edit item">
  <i class="ri-edit-line"></i>
</tolle-button>

<!-- Or use both tooltip and sr-only text -->
<tolle-button size="icon" variant="ghost" tolleTooltip="Edit">
  <i class="ri-edit-line"></i>
  <span class="sr-only">Edit</span>
</tolle-button>
```
