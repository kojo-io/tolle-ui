# Slider Component Usage Guide

## Overview

The Slider component is a range slider for selecting values within a specified range. It supports single value selection and range selection (two thumbs), with touch and keyboard support.

## Import

```typescript
import { SliderComponent } from '@tolle_/tolle-ui';
```

## Component

### SliderComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disabled state |
| `class` | `string` | `''` | Additional CSS classes |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `valueChange` | `EventEmitter<number \| number[]>` | Emitted when value changes |

## Basic Usage

```html
<tolle-slider [min]="0" [max]="100" [step]="1" [ngModel]="50" class="w-[60%]"></tolle-slider>
```

## Accessibility

- Full keyboard navigation (arrow keys, Home, End)
- Focus management
- ARIA attributes for screen readers
- Required and error states announced correctly

## Custom Styling

```html
<tolle-slider
  class="custom-slider"
></tolle-slider>
```

```css
.custom-slider {
  /* Custom track color */
  --range-track-bg: #e5e7eb;
  --range-thumb-bg: #6366f1;
}
```

## Value Constraints

### Enforcing Minimum Difference

```html
<tolle-slider
  [min]="0"
  [max]="100"
  [(ngModel)]="range"
></tolle-slider>
```

```typescript
range = [20, 80];

onRangeChange(value: number[]) {
  const [min, max] = value;
  // Ensure minimum 10 unit difference
  if (max - min < 10) {
    if (this.lastChanged === 'min') {
      this.range = [min, min + 10];
    } else {
      this.range = [max - 10, max];
    }
  } else {
    this.range = value;
  }
}
```
