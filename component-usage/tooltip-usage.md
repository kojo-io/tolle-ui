# Tooltip Directive Usage Guide

## Overview

The TooltipDirective provides a lightweight tooltip that displays additional information when hovering over or focusing on an element.

## Import

```typescript
import { TooltipDirective } from '@tolle_/tolle-ui';
```

## TooltipDirective

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `tolleTooltip` | `string\|TemplateRef` | `''` | Content to display (required) |
| `tolleTooltipTrigger` | `'mouseenter'\|'click'\|'focus'` | `'mouseenter'` | Trigger event |
| `tolleTooltipPosition` | `'top'\|'bottom'\|'left'\|'right'` | `'top'` | Tooltip position |
| `tolleTooltipDelay` | `number` | `0` | Display delay in ms |

## Basic Usage

### Simple Tooltip

```html
<button
  [tolleTooltip]="'This is a tooltip'"
  tolleTooltipTrigger="mouseenter"
>
  Hover me
</button>
```

### Tooltip with Position

```html
<button
  [tolleTooltip]="'Top tooltip'"
  tolleTooltipPosition="top"
>
  Top
</button>

<button
  [tolleTooltip]="'Bottom tooltip'"
  tolleTooltipPosition="bottom"
>
  Bottom
</button>

<button
  [tolleTooltip]="'Left tooltip'"
  tolleTooltipPosition="left"
>
  Left
</button>

<button
  [tolleTooltip]="'Right tooltip'"
  tolleTooltipPosition="right"
>
  Right
</button>
```

## Tooltip Trigger Events

### Mouse Enter (Default)

```html
<button
  [tolleTooltip]="'Hover to see tooltip'"
  tolleTooltipTrigger="mouseenter"
>
  Hover me
</button>
```

### Click Trigger

```html
<button
  [tolleTooltip]="'Click to toggle tooltip'"
  tolleTooltipTrigger="click"
>
  Click me
</button>
```

### Focus Trigger

```html
<input
  type="text"
  [tolleTooltip]="'Enter your email'"
  tolleTooltipTrigger="focus"
  placeholder="Email"
/>
```

## Tooltip with Delay

```html
<button
  [tolleTooltip]="'Delayed tooltip'"
  tolleTooltipDelay="500"
  tolleTooltipTrigger="mouseenter"
>
  Hover (500ms delay)
</button>
```

## Tooltip with Icon

### Icon with Tooltip

```html
<i
  class="ri-question-line text-muted-foreground"
  [tolleTooltip]="'Help information'"
  tolleTooltipPosition="right"
></i>
```

### Tooltip on Icon Button

```html
<button
  [tolleTooltip]="'Edit profile'"
  tolleTooltipPosition="bottom"
>
  <i class="ri-edit-line"></i>
</button>
```

## Tooltip in Card

```html
<tolle-card>
  <tolle-card-header>
    <div class="flex justify-between items-center">
      <tolle-card-title>Tasks</tolle-card-title>
      <button
        [tolleTooltip]="'Refresh list'"
        tolleTooltipPosition="bottom"
        class="p-2 hover:bg-accent rounded"
      >
        <i class="ri-refresh-line"></i>
      </button>
    </div>
  </tolle-card-header>
  <tolle-card-content>
    <!-- Content -->
  </tolle-card-content>
</tolle-card>
```

## Tooltip with Form Label

```html
<div class="space-y-2">
  <label
    class="flex items-center gap-1"
    for="email"
  >
    <span>Email Address</span>
    <i
      class="ri-question-line text-xs"
      [tolleTooltip]="'Enter a valid email address'"
      tolleTooltipPosition="right"
    ></i>
  </label>
  <input
    type="email"
    id="email"
    placeholder="Enter your email"
  />
</div>
```

## Tooltip with Menu Items

```html
<div class="flex flex-col space-y-1">
  <button
    [tolleTooltip]="'New file'"
    tolleTooltipPosition="right"
    class="p-2 hover:bg-accent rounded"
  >
    <i class="ri-file-add-line"></i>
  </button>
  <button
    [tolleTooltip]="'Open file'"
    tolleTooltipPosition="right"
    class="p-2 hover:bg-accent rounded"
  >
    <i class="ri-folder-open-line"></i>
  </button>
  <button
    [tolleTooltip]="'Save file'"
    tolleTooltipPosition="right"
    class="p-2 hover:bg-accent rounded"
  >
    <i class="ri-save-line"></i>
  </button>
</div>
```

## Tooltip with Avatar

```html
<div class="flex items-center gap-2">
  <tolle-avatar>
    <tolle-avatar-image src="avatar.jpg" />
    <tolle-avatar-fallback>JD</tolle-avatar-fallback>
  </tolle-avatar>
  <div>
    <div class="font-medium">John Doe</div>
    <div class="text-sm text-muted-foreground">
      <button
        [tolleTooltip]="'Send message'"
        tolleTooltipPosition="top"
        class="hover:text-primary"
      >
        <i class="ri-message-line"></i>
      </button>
    </div>
  </div>
</div>
```

## Tooltip with Progress

```html
<div class="space-y-2">
  <div class="flex justify-between text-sm">
    <span>Processing</span>
    <button
      [tolleTooltip]="'View status'"
      tolleTooltipPosition="top"
      class="hover:text-primary"
    >
      <i class="ri-terminal-box-line"></i>
    </button>
  </div>
  <progress-component [value]="75" class="h-2"></progress-component>
</div>
```

## Tooltip with Action Button

```html
<button
  [tolleTooltip]="'Add to favorites'"
  tolleTooltipPosition="bottom"
  class="p-2 hover:bg-accent rounded"
>
  <i class="ri-heart-line"></i>
</button>
```

## Tooltip in Data Table

```html
<table class="w-full">
  <thead>
    <tr>
      <th class="p-2 text-left">
        <span class="flex items-center gap-2">
          Name
          <i
            class="ri-question-line text-xs"
            [tolleTooltip]="'Sort by name'"
            tolleTooltipPosition="bottom"
          ></i>
        </span>
      </th>
      <th class="p-2 text-left">
        <span class="flex items-center gap-2">
          Status
          <i
            class="ri-question-line text-xs"
            [tolleTooltip]="'Current status'"
            tolleTooltipPosition="bottom"
          ></i>
        </span>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="p-2">John Doe</td>
      <td class="p-2">
        <tolle-badge variant="default">Active</tolle-badge>
      </td>
    </tr>
  </tbody>
</table>
```

## Tooltip with Custom Content

### Template Ref (if supported)

```html
<ng-template #tooltipContent>
  <div class="space-y-1">
    <div class="font-semibold">User Profile</div>
    <div class="text-sm">Click to view details</div>
  </div>
</ng-template>

<button
  [tolleTooltip]="tooltipContent"
  tolleTooltipPosition="top"
>
  View Profile
</button>
```

## Tooltip in Form

```html
<form class="space-y-4">
  <div class="space-y-1">
    <label for="password" class="flex items-center gap-1">
      Password
      <i
        class="ri-question-line text-xs"
        [tolleTooltip]="'Must be at least 8 characters'"
        tolleTooltipPosition="right"
      ></i>
    </label>
    <input
      type="password"
      id="password"
      placeholder="Enter password"
    />
  </div>

  <div class="space-y-1">
    <label for="confirm" class="flex items-center gap-1">
      Confirm Password
      <i
        class="ri-question-line text-xs"
        [tolleTooltip]="'Re-enter your password'"
        tolleTooltipPosition="right"
      ></i>
    </label>
    <input
      type="password"
      id="confirm"
      placeholder="Confirm password"
    />
  </div>
</form>
```

## Tooltip on Disabled Element

```html
<button
  [tolleTooltip]="'Feature not available'"
  tolleTooltipTrigger="mouseenter"
  [disabled]="true"
>
  <i class="ri-lock-line"></i>
</button>
```
