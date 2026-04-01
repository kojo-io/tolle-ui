# Badge Component Usage Guide

## Overview

The Badge component displays a small, colored indicator used for notifications, counts, or status labels. It supports multiple variants, sizes, and can be made removable.

## Import

```typescript
import { BadgeComponent } from '@tolle_/tolle-ui';
```

## BadgeComponent

**Selector:** `tolle-badge`

**Inputs:**

| Input       | Type                                                     | Default     | Description                   |
| ----------- | -------------------------------------------------------- | ----------- | ----------------------------- |
| `variant`   | `'default' \| 'secondary' \| 'outline' \| 'destructive'` | `'default'` | Badge variant style           |
| `size`      | `'xs' \| 'sm' \| 'default'`                              | `'default'` | Badge size                    |
| `removable` | `boolean`                                                | `false`     | Whether to show remove button |
| `class`     | `string`                                                 | `''`        | Additional CSS classes        |

**Outputs:**

| Output     | Type                       | Description                           |
| ---------- | -------------------------- | ------------------------------------- |
| `onRemove` | `EventEmitter<MouseEvent>` | Emitted when remove button is clicked |

**Content Slots:**

| Slot       | Description                                     |
| ---------- | ----------------------------------------------- |
| `[prefix]` | Optional content before badge text (e.g., icon) |
| Default    | Badge text content                              |

## Basic Usage

### Badge Variants

```html
<div class="flex flex-wrap items-center gap-4">
  <tolle-badge>Default</tolle-badge>
  <tolle-badge variant="secondary">Secondary</tolle-badge>
  <tolle-badge variant="outline">Outline</tolle-badge>
  <tolle-badge variant="destructive">Destructive</tolle-badge>
</div>
```

### Badge Sizes

```html
<div class="flex flex-wrap items-center gap-4">
  <tolle-badge size="xs">XS Tag</tolle-badge>
  <tolle-badge size="sm">SM Tag</tolle-badge>
  <tolle-badge size="default">Default Tag</tolle-badge>
</div>
```

### Removable Badge

```html
<div class="flex flex-wrap gap-2">
  @for (tag of tags; track tag.id) {
  <tolle-badge [removable]="true" (onRemove)="removeTag(tag.id)"> {{ tag.label }} </tolle-badge>
  }
</div>
```

```typescript
import { Component } from '@angular/core';
import { BadgeComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BadgeComponent],
  template: `...`,
})
export class ExampleComponent {
  tags = [
    { id: 1, label: 'Angular' },
    { id: 2, label: 'React' },
    { id: 3, label: 'Vue' },
  ];

  removeTag(id: number) {
    this.tags = this.tags.filter(t => t.id !== id);
  }
}
```

### Badge with Icons

```html
<div class="flex flex-wrap gap-2">
  <tolle-badge>
    <i prefix class="ri-check-line"></i>
    Success
  </tolle-badge>

  <tolle-badge variant="secondary">
    <i prefix class="ri-price-tag-3-line"></i>
    E-commerce
  </tolle-badge>

  <tolle-badge variant="outline">
    <i prefix class="ri-star-line"></i>
    Featured
  </tolle-badge>
</div>
```

## Use Cases

### Status Indicators

```html
<tolle-badge variant="success">Active</tolle-badge>
<tolle-badge variant="destructive">Inactive</tolle-badge>
<tolle-badge variant="secondary">Pending</tolle-badge>
<tolle-badge variant="outline">Draft</tolle-badge>
```

### Notification Counters

```html
<tolle-button variant="outline">
  <i class="ri-notification-line"></i>
  <tolle-badge size="xs" variant="destructive">3</tolle-badge>
</tolle-button>

<tolle-button variant="outline">
  <i class="ri-mail-line"></i>
  <tolle-badge size="xs" variant="destructive" class="ml-1">12</tolle-badge>
</tolle-button>
```

### Tag Input

```html
<div class="flex flex-wrap gap-2 rounded-md border p-2">
  @for (skill of skills; track skill) {
  <tolle-badge variant="secondary" [removable]="true" (onRemove)="removeSkill(skill)">
    {{ skill }}
  </tolle-badge>
  }
  <input
    type="text"
    placeholder="Add skill..."
    class="min-w-[100px] flex-1 border-none outline-none"
    (keydown.enter)="addSkill($event)" />
</div>
```

```typescript
import { Component } from '@angular/core';
import { BadgeComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BadgeComponent],
  template: `...`,
})
export class ExampleComponent {
  skills = ['Angular', 'TypeScript', 'RxJS'];

  addSkill(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.trim()) {
      this.skills.push(input.value.trim());
      input.value = '';
    }
  }

  removeSkill(skill: string) {
    this.skills = this.skills.filter(s => s !== skill);
  }
}
```

### Categories/Labels

```html
<div class="space-y-2">
  <div>
    <span class="text-sm font-medium">Categories:</span>
    <tolle-badge variant="outline" class="ml-2">Technology</tolle-badge>
    <tolle-badge variant="outline" class="ml-2">Design</tolle-badge>
    <tolle-badge variant="outline" class="ml-2">Business</tolle-badge>
  </div>

  <div>
    <span class="text-sm font-medium">Priority:</span>
    <tolle-badge variant="destructive" class="ml-2">High</tolle-badge>
  </div>

  <div>
    <span class="text-sm font-medium">Status:</span>
    <tolle-badge variant="secondary" class="ml-2">In Progress</tolle-badge>
  </div>
</div>
```

### User Role Badges

```html
<div class="flex items-center gap-2">
  <span class="font-medium">John Doe</span>
  <tolle-badge variant="secondary" size="xs">Admin</tolle-badge>
</div>

<div class="flex items-center gap-2">
  <span class="font-medium">Jane Smith</span>
  <tolle-badge variant="outline" size="xs">Member</tolle-badge>
</div>
```

### Filter Tags

```html
<div class="mb-4 flex flex-wrap gap-2">
  <span class="text-sm font-medium">Active filters:</span>
  @for (filter of activeFilters; track filter.id) {
  <tolle-badge variant="secondary" [removable]="true" (onRemove)="removeFilter(filter.id)">
    {{ filter.label }}
  </tolle-badge>
  } @if (activeFilters.length > 0) {
  <button class="text-sm text-primary hover:underline" (click)="clearFilters()">Clear all</button>
  }
</div>
```

### Version Badge

```html
<tolle-badge variant="outline" size="xs"> v2.0.0 </tolle-badge>

<tolle-badge variant="destructive" size="xs"> Beta </tolle-badge>

<tolle-badge variant="secondary" size="xs"> New </tolle-badge>
```

### Inline Badges in Text

```html
<p class="text-sm">
  This feature is available in our
  <tolle-badge variant="secondary" size="xs">Pro</tolle-badge>
  and
  <tolle-badge variant="destructive" size="xs">Enterprise</tolle-badge>
  plans.
</p>
```

## Variants

| Variant       | Description                | Use Case                     |
| ------------- | -------------------------- | ---------------------------- |
| `default`     | Primary color background   | Default status, count badges |
| `secondary`   | Secondary gray background  | Neutral labels, categories   |
| `outline`     | Bordered transparent       | Subtle labels, tags          |
| `destructive` | Destructive red background | Errors, critical status      |

## Sizes

| Size      | Description | Use Case                             |
| --------- | ----------- | ------------------------------------ |
| `xs`      | Extra small | Notification counters, inline badges |
| `sm`      | Small       | Compact labels                       |
| `default` | Default     | Standard badges                      |
