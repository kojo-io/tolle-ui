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

### Single Accordion Item

```html
<tolle-accordion>
  <tolle-accordion-item>
    <button tolleAccordionTrigger>
      Is this accessible?
    </button>
    <div tolleAccordionContent>
      <p>Yes. It adheres to the WAI-ARIA design pattern.</p>
    </div>
  </tolle-accordion-item>
</tolle-accordion>
```

### Multiple Accordion Items

```html
<tolle-accordion class="w-full max-w-[400px]">
  <tolle-accordion-item>
    <button tolleAccordionTrigger>
      Is it styled?
    </button>
    <div tolleAccordionContent>
      <p>Yes. It comes with default styles that match the other components' aesthetic.</p>
    </div>
  </tolle-accordion-item>

  <tolle-accordion-item>
    <button tolleAccordionTrigger>
      Is it animated?
    </button>
    <div tolleAccordionContent>
      <p>Yes. It's animated by default, but you can disable it if you prefer.</p>
    </div>
  </tolle-accordion-item>
</tolle-accordion>
```

### Disabled Accordion

```html
<tolle-accordion>
  <tolle-accordion-item [disabled]="true">
    <button tolleAccordionTrigger>
      Disabled Item
    </button>
    <div tolleAccordionContent>
      <p>This item cannot be opened.</p>
    </div>
  </tolle-accordion-item>
</tolle-accordion>
```

## Custom Styling

```html
<tolle-accordion class="border rounded-lg">
  <tolle-accordion-item class="border-b last:border-0">
    <button tolleAccordionTrigger class="flex items-center justify-between w-full p-4 font-medium">
      <span>Question</span>
      <i class="ri-arrow-down-s-line transition-transform duration-200"></i>
    </button>
    <div tolleAccordionContent class="px-4 pb-4 text-muted-foreground">
      <p>Answer content here...</p>
    </div>
  </tolle-accordion-item>
</tolle-accordion>
```

## Accordion Trigger Pattern

The trigger is typically a button that toggles the accordion content:

```html
<tolle-accordion-item>
  <button tolleAccordionTrigger>
    <div class="flex items-center justify-between w-full">
      <span>Toggle Me</span>
      <i class="ri-arrow-down-s-line transition-transform duration-300"></i>
    </div>
  </button>
  <div tolleAccordionContent class="overflow-hidden">
    <div class="pb-4">
      <p>Content goes here...</p>
    </div>
  </div>
</tolle-accordion-item>
```

## Accessibility

The accordion follows WAI-ARIA design patterns:
- Uses `button` elements for triggers
- Supports keyboard navigation (Enter, Space, Arrow keys)
- Proper ARIA attributes for expanded/collapsed states
