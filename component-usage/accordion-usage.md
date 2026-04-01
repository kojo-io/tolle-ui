# Accordion Component Usage Guide

## Overview

The Accordion component allows users to toggle the visibility of content sections. It consists of a container component (`AccordionComponent`) and individual item components (`AccordionItemComponent`).

## Import

```typescript
import { AccordionComponent, AccordionItemComponent } from '@tolle_/tolle-ui';
```

## Components

### AccordionComponent

Container for accordion items.

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

**Sub-components:**

- `AccordionItemComponent` - Individual expandable/collapsible item

### AccordionItemComponent

Individual accordion item with expand/collapse functionality.

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Whether the item is disabled |

## Basic Usage

### Basic Accordion

```html
<tolle-accordion>
    <tolle-accordion-item title="Can I open many at once?">
        Yes, because the type is set to multiple by default or explicitly.
    </tolle-accordion-item>
    <tolle-accordion-item title="Is it animated?">
        No, it uses static rendering for a snappy, high-performance feel.
    </tolle-accordion-item>
</tolle-accordion>
```

### Multiple Accordion

```html
<tolle-accordion type="multiple">
    <tolle-accordion-item title="Can I open many at once?">
        Yes, because the type is set to multiple.
    </tolle-accordion-item>
    <tolle-accordion-item title="Is it animated?">
        No, it uses static rendering for a snappy, high-performance feel.
    </tolle-accordion-item>
</tolle-accordion>
```

## Accessibility

The accordion follows WAI-ARIA design patterns:

- Uses `button` elements for triggers
- Supports keyboard navigation (Enter, Space, Arrow keys)
- Proper ARIA attributes for expanded/collapsed states
