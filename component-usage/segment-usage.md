# Segment Component Usage Guide

## Overview

The Segment component provides a tab-like control for selecting between different options. It features a sliding indicator and supports form integration via ControlValueAccessor.

## Import

```typescript
import { SegmentedComponent } from '@tolle_/tolle-ui';
```

## Component

### SegmentedComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `items` | `SegmentItem[]` | `[]` | Array of segment items |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Whether the segment is disabled |
| `itemTemplate` | `TemplateRef<any>` | - | Custom template for items |

**SegmentItem Interface:**

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Item label |
| `value` | `any` | Item value |
| `disabled` | `boolean` | Whether item is disabled |
| `icon` | `string` | Optional icon class |
| `class` | `string` | Optional custom class |
| `data` | `any` | Optional data payload |

## Basic Usage

### Simple Segment

```html
<tolle-segment
  [items]="items"
  [(ngModel)]="selectedValue"
></tolle-segment>
```

```typescript
items: SegmentItem[] = [
  { label: 'Options', value: 'options' },
  { label: 'Search', value: 'search' },
  { label: 'Filters', value: 'filters' }
];

selectedValue: string = 'options';
```

### Segment with Icons

```html
<tolle-segment
  [items]="items"
  [(ngModel)]="viewMode"
></tolle-segment>
```

```typescript
items: SegmentItem[] = [
  { label: 'List', value: 'list', icon: 'ri-list-ul' },
  { label: 'Grid', value: 'grid', icon: 'ri-grid-3x3' },
  { label: 'Cards', value: 'cards', icon: 'ri-image-line' }
];
```

## Controlled Segment

### Programmatic Control

```html
<tolle-segment
  [items]="items"
  [value]="activeTab"
  (valueChange)="onTabChange($event)"
></tolle-segment>
```

```typescript
activeTab: string = 'home';

onTabChange(value: string) {
  this.activeTab = value;
}
```

## Form Integration

### Reactive Forms

```typescript
form = this.fb.group({
  preference: ['option1']
});

constructor(private fb: FormBuilder) {}
```

```html
<tolle-segment
  formControlName="preference"
  [items]="items"
></tolle-segment>
```

### Template-Driven Forms

```html
<tolle-segment
  [(ngModel)]="userPreference"
  [items]="items"
  name="preference"
></tolle-segment>
```

## Custom Item Template

### Custom Content

```html
<tolle-segment [items]="items" [itemTemplate]="customItem">
  <ng-template #customItem let-item let-selected="selected">
    <div class="flex items-center gap-2">
      <i [class]="item.icon"></i>
      <span>{{ item.label }}</span>
      <span *ngIf="selected" class="text-xs">(Active)</span>
    </div>
  </ng-template>
</tolle-segment>
```

```typescript
items: SegmentItem[] = [
  {
    label: 'Dashboard',
    value: 'dashboard',
    icon: 'ri-home-line'
  },
  {
    label: 'Analytics',
    value: 'analytics',
    icon: 'ri-bar-chart-line'
  }
];
```

## Segment with Data

### Custom Data Payload

```html
<tolle-segment [items]="products" [itemTemplate]="productTemplate">
  <ng-template #productTemplate let-item let-selected="selected">
    <div class="flex flex-col items-center gap-1">
      <div [class]="'w-2 h-2 rounded-full ' + (selected ? 'bg-primary' : 'bg-muted')"></div>
      <span class="text-xs">{{ item.data.price }}</span>
    </div>
  </ng-template>
</tolle-segment>
```

```typescript
products: SegmentItem[] = [
  {
    label: 'Basic',
    value: 'basic',
    data: { price: '$9', features: 5 }
  },
  {
    label: 'Pro',
    value: 'pro',
    data: { price: '$29', features: 20 }
  },
  {
    label: 'Enterprise',
    value: 'enterprise',
    data: { price: '$99', features: 100 }
  }
];
```

## Disabled Segment

### Disabled Items

```html
<tolle-segment
  [items]="items"
  [(ngModel)]="selected"
  [disabled]="isSubmitting"
></tolle-segment>
```

```typescript
items: SegmentItem[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2', disabled: true },
  { label: 'Option 3', value: '3' }
];

isSubmitting = false;
```

### Disabled Component

```html
<tolle-segment
  [items]="items"
  [disabled]="true"
></tolle-segment>
```

## Segment Variants

### Pill Style

```html
<tolle-segment
  [items]="items"
  class="bg-secondary rounded-full p-1"
></tolle-segment>
```

```typescript
items: SegmentItem[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' }
];
```

### Compact Segment

```html
<tolle-segment
  [items]="items"
  class="gap-0.5"
></tolle-segment>
```

### Wide Segment

```html
<tolle-segment
  [items]="items"
  class="w-full"
></tolle-segment>
```

## Segment in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>View Settings</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="p-4">
    <tolle-segment
      [items]="items"
      [(ngModel)]="viewMode"
    ></tolle-segment>
  </tolle-card-content>
</tolle-card>
```

## Segment with Dynamic Items

### Responsive Items

```typescript
items = signal<SegmentItem[]>([
  { label: 'Home', value: 'home' },
  { label: 'Profile', value: 'profile' }
]);

updateItems(newItems: SegmentItem[]) {
  this.items.set(newItems);
}
```

```html
<tolle-segment
  [items]="items()"
  [(ngModel)]="selected"
></tolle-segment>

<button (click)="updateItems(newItems)">
  Update Items
</button>
```

## Segment Value Access

### Getting Selected Value

```typescript
@Component({
  template: `
    <tolle-segment [items]="items" (valueChange)="onValueChange($event)"></tolle-segment>
    <p>Selected: {{ selected }}</p>
  `
})
export class ExampleComponent {
  selected = '';

  onValueChange(value: any) {
    this.selected = value;
    // Perform actions based on selection
  }
}
```
