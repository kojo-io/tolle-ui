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

### Simple Slider

```html
<tolle-slider
  [min]="0"
  [max]="100"
  [(ngModel)]="value"
></tolle-slider>

<p>Selected value: {{ value }}</p>
```

### With Step

```html
<tolle-slider
  [min]="0"
  [max]="10"
  [step]="0.5"
  [(ngModel)]="value"
></tolle-slider>

<p>Selected value: {{ value }}</p>
```

### Disabled Slider

```html
<tolle-slider
  [min]="0"
  [max]="100"
  [disabled]="true"
  [value]="75"
></tolle-slider>
```

## Range Selection (Two Thumbs)

### Basic Range Slider

```html
<tolle-slider
  [min]="0"
  [max]="100"
  [(ngModel)]="range"
></tolle-slider>

<p>Range: {{ range[0] }} - {{ range[1] }}</p>
```

```typescript
// Initialize range as array
range = [25, 75];
```

### Range Slider with Step

```html
<tolle-slider
  [min]="0"
  [max]="24"
  [step]="1"
  [(ngModel)]="timeRange"
></tolle-slider>

<p>Time range: {{ timeRange[0] }}:00 - {{ timeRange[1] }}:00</p>
```

## Value Change Handler

```html
<tolle-slider
  [min]="0"
  [max]="100"
  [(ngModel)]="value"
  (valueChange)="onValueChange($event)"
></tolle-slider>
```

```typescript
onValueChange(value: number | number[]) {
  console.log('Value changed:', value);
}
```

## Form Integration

### Template-Driven Form

```html
<form #form="ngForm">
  <tolle-slider
    name="rating"
    [(ngModel)]="formData.rating"
    #rating="ngModel"
    [min]="1"
    [max]="5"
    [step]="0.5"
  ></tolle-slider>

  <p>Rating: {{ formData.rating }}</p>
</form>
```

### Reactive Form

```typescript
this.form = this.fb.group({
  rating: [3],
  priceRange: [[10, 100]],
});

// Access values
get ratingValue() {
  return this.form.get('rating')?.value;
}

get priceRangeValue() {
  return this.form.get('priceRange')?.value;
}
```

## Single Value Slider Examples

### Volume Control

```html
<tolle-slider
  [min]="0"
  [max]="100"
  [(ngModel)]="volume"
></tolle-slider>

<div class="flex items-center gap-2">
  <i class="ri-volume-down-line"></i>
  <div class="flex-1">
    <tolle-slider [min]="0" [max]="100" [(ngModel)]="volume"></tolle-slider>
  </div>
  <i class="ri-volume-up-line"></i>
</div>
<p>Volume: {{ volume }}%</p>
```

### Rating System

```html
<tolle-slider
  [min]="1"
  [max]="5"
  [step]="0.5"
  [(ngModel)]="rating"
></tolle-slider>

<div class="flex items-center gap-1">
  <i *ngFor="let i of [1, 2, 3, 4, 5]"
     [class."ri-star-fill"]="$index < rating"
     [class."ri-star-line"]="$index >= rating"
     class="text-yellow-500">
  </i>
</div>
<p>Rating: {{ rating }} / 5</p>
```

### Price Range Filter

```html
<tolle-slider
  [min]="0"
  [max]="1000"
  [step]="10"
  [(ngModel)]="priceRange"
></tolle-slider>

<div class="flex gap-2 mt-2">
  <div>
    <label class="text-xs">Min Price</label>
    <input type="number" [value]="priceRange[0]" (input)="updateMin($event)" />
  </div>
  <div>
    <label class="text-xs">Max Price</label>
    <input type="number" [value]="priceRange[1]" (input)="updateMax($event)" />
  </div>
</div>
```

```typescript
priceRange = [100, 500];

updateMin(event: Event) {
  const value = Number((event.target as HTMLInputElement).value);
  this.priceRange = [value, this.priceRange[1]];
}

updateMax(event: Event) {
  const value = Number((event.target as HTMLInputElement).value);
  this.priceRange = [this.priceRange[0], value];
}
```

## Range Slider Examples

### Time Range Selector

```html
<tolle-slider
  [min]="0"
  [max]="24"
  [step]="0.5"
  [(ngModel)]="timeRange"
></tolle-slider>

<p>Available from: {{ formatTime(timeRange[0]) }} to {{ formatTime(timeRange[1]) }}</p>
```

```typescript
formatTime(hour: number): string {
  const h = Math.floor(hour);
  const m = (hour % 1) * 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  const displayMin = m === 0 ? '00' : m;
  return `${displayHour}:${displayMin} ${ampm}`;
}
```

### Age Range

```html
<tolle-slider
  [min]="18"
  [max]="100"
  [step]="1"
  [(ngModel)]="ageRange"
></tolle-slider>

<p>Age range: {{ ageRange[0] }} - {{ ageRange[1] }}</p>
```

## Size Customization

The slider automatically adjusts to its container width:

```html
<div style="width: 300px;">
  <tolle-slider [min]="0" [max]="100" [(ngModel)]="value"></tolle-slider>
</div>

<div style="width: 100%;">
  <tolle-slider [min]="0" [max]="100" [(ngModel)]="value"></tolle-slider>
</div>
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
