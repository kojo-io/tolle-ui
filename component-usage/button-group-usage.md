# Button Group Component Usage Guide

## Overview

The Button Group component groups multiple buttons together, creating a cohesive toolbar-like interface. It automatically handles border radius and spacing between buttons for a seamless appearance.

## Import

```typescript
import { ButtonGroupComponent } from '@tolle_/tolle-ui';
```

## Components

### ButtonGroupComponent

Container component that wraps multiple buttons together.

**Selector:** `tolle-button-group`

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

## Basic Usage

### Basic Button Group

```html
<tolle-button-group>
  <tolle-button>Left</tolle-button>
  <tolle-button>Center</tolle-button>
  <tolle-button>Right</tolle-button>
</tolle-button-group>
```

### Button Group with Variants

```html
<tolle-button-group>
  <tolle-button variant="outline">Day</tolle-button>
  <tolle-button variant="outline">Week</tolle-button>
  <tolle-button variant="outline">Month</tolle-button>
  <tolle-button variant="outline">Year</tolle-button>
</tolle-button-group>
```

### Button Group with Icon Buttons

```html
<tolle-button-group>
  <tolle-button size="icon" variant="outline">
    <i class="ri-align-left"></i>
  </tolle-button>
  <tolle-button size="icon" variant="outline">
    <i class="ri-align-center"></i>
  </tolle-button>
  <tolle-button size="icon" variant="outline">
    <i class="ri-align-right"></i>
  </tolle-button>
</tolle-button-group>
```

### Button Group with Mixed Styles

```html
<tolle-button-group>
  <tolle-button variant="destructive">Delete</tolle-button>
  <tolle-button variant="outline">Edit</tolle-button>
  <tolle-button variant="outline">View</tolle-button>
</tolle-button-group>
```

## Styling

The button group automatically:

- Removes right border-radius from the first button
- Removes all border-radius from middle buttons and removes left border to prevent double-thickness
- Removes left border-radius from the last button and removes left border
- Brings hovered/focused buttons to the front (z-index) to show focus rings properly

### Custom Styling

```html
<tolle-button-group class="shadow-lg">
  <tolle-button>Option 1</tolle-button>
  <tolle-button>Option 2</tolle-button>
</tolle-button-group>
```

## Accessibility

- Use `role="group"` or `role="toolbar"` for button groups with related actions
- Ensure each button has proper focus states (handled automatically)
- For toolbar patterns, implement arrow key navigation between buttons

## Use Cases

### Toolbar Actions

```html
<tolle-button-group>
  <tolle-button size="icon" variant="outline" tolleTooltip="Bold">
    <i class="ri-bold"></i>
  </tolle-button>
  <tolle-button size="icon" variant="outline" tolleTooltip="Italic">
    <i class="ri-italic"></i>
  </tolle-button>
  <tolle-button size="icon" variant="outline" tolleTooltip="Underline">
    <i class="ri-underline"></i>
  </tolle-button>
</tolle-button-group>
```

### Segmented Control Alternative

```html
<tolle-button-group>
  <tolle-button
    variant="outline"
    [class]="view === 'grid' ? 'bg-accent' : ''"
    (click)="view = 'grid'">
    <i class="ri-grid-fill"></i>
  </tolle-button>
  <tolle-button
    variant="outline"
    [class]="view === 'list' ? 'bg-accent' : ''"
    (click)="view = 'list'">
    <i class="ri-list-check"></i>
  </tolle-button>
</tolle-button-group>
```
