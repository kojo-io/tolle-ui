# Documentation Accuracy Report

## Mismatches Found

### 1. Alert Component (`alert-usage.md`)

**Source Code:**

```typescript
@Input() variant: 'default' | 'destructive' | 'success' | 'warning' | 'info' = 'default';
@Input() title: string | undefined = undefined;
@Input() dismissible: boolean = false;
@Output() onClose = new EventEmitter<void>();
```

**Current Doc Issues:**

- `variant` type is incomplete - missing `'success' | 'warning' | 'info'`
- Missing `title` input
- Missing `dismissible` input
- Missing `onClose` output

---

### 2. Calendar Component (`calendar-usage.md`)

**Source Code:**

```typescript
@Input() showQuickActions: boolean = true;  // NOT false
```

**Current Doc Issue:**

- Shows `showQuickActions` default as `false` but should be `true`

---

### 3. Popover Component (`popover-usage.md`)

**Source Code:**

```typescript
@Input() placement: 'top' | 'bottom' | 'left' | 'right' |
                   'top-start' | 'top-end' |
                   'bottom-start' | 'bottom-end' |
                   'left-start' | 'left-end' |
                   'right-start' | 'right-end' = 'bottom';

@Output() onOpen = new EventEmitter<void>();
@Output() onClose = new EventEmitter<void>();
```

**Current Doc Issues:**

- `placement` type incomplete - missing start/end variants
- Outputs are `onOpen` and `onClose`, NOT `onOpenChange`
- Missing `open` input for controlled state

---

### 4. Collapsible Component (`collapsible-usage.md`)

**Source Code:**

```typescript
@Input() open: boolean;
@Input() class: string = '';
@Output() openChange = new EventEmitter<boolean>();
```

**Current Doc Issue:**

- Lists `openChange` as Input instead of Output in the table

---

### 5. Breadcrumb Component (`breadcrumb-usage.md`)

**Source Code:**

```typescript
// BreadcrumbLinkComponent
@Input() active: boolean = false;
```

**Current Doc Issue:**

- Missing `active` input on `BreadcrumbLinkComponent`

---

### 6. Card Component (`card-usage.md`)

**Source Code Analysis:**

- No `CardDescriptionComponent` exists in source
- Only 5 components: Card, CardHeader, CardTitle, CardContent, CardFooter

**Current Doc Issue:**

- Doc references `CardDescriptionComponent` which doesn't exist

---

### 7. Tooltip Directive (`tooltip-usage.md`)

**Source Code:**

```typescript
@Input() tolleTooltip: string = '';
@Input() tolleTooltipTrigger: 'mouseenter' | 'click' | 'focus' = 'mouseenter';
@Input() tolleTooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
@Input() tolleTooltipDelay: number = 0;
```

**Current Doc Issue:**

- Uses `placement` instead of `tolleTooltipPosition`
- Missing `tolleTooltipTrigger` input
- Missing `tolleTooltipDelay` input

---

### 8. Context Menu (`context-menu-usage.md`)

**Source Code Type:**

```typescript
type ContextMenuItem = {
  id?: string;
  label?: string; // Not required
  icon?: string;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
  shortcut?: string;
  checked?: boolean;
  type?: 'default' | 'checkbox' | 'radio';
};
```

**Current Doc Issue:**

- Type table should show all optional properties

---

### 9. Sheet Component (`sheet-usage.md`)

Need to verify `SheetRef` has `afterClosed$` not `isOpenChange`.

---

### 10. Tabs Component (`tabs-usage.md`)

**Source Code:**

- Uses `valueChange` output, not `onOpenChange`

---

### 11. Skeleton Component (`skeleton-usage.md`)

**Source Code:**

```typescript
@Input() variant: 'rect' | 'circle' | 'pill' = 'rect';
```

Doc should show all 3 variants.

---

### 12. Badge Component (`badge-usage.md`)

Need to verify `onRemove` output exists.

---

### 13. Progress Component (`progress-usage.md`)

Need to verify it accepts `null` for `value` (indeterminate state).

---

## Components Without Documentation Files

All major components have documentation files.

## Recommendations

1. Fix input/output type definitions to match source
2. Update placement options for Popover
3. Remove non-existent CardDescriptionComponent reference
4. Add missing inputs (dismissible, title, active)
5. Add missing outputs (onClose, onOpen, onClose)
6. Fix default values where they differ
