# Tolle UI Library - Component Import Alias

All components from the `@tolle_/tolle-ui` library are imported using the component name with `Component` suffix (or `Directive` for directives).

## Import Pattern

```typescript
import {
  ScrollAreaComponent,
  AvatarComponent,
  ButtonComponent,
  TooltipDirective,
  PopoverComponent,
  DropdownMenuComponent,
  SkeletonComponent,
  // ... other components
} from '@tolle_/tolle-ui';
```

## Naming Convention

| Component | Import Name | Notes |
|-----------|-------------|-------|
| Button | `ButtonComponent` | Ends with `Component` |
| Tooltip | `TooltipDirective` | Ends with `Directive` |
| ScrollArea | `ScrollAreaComponent` | Ends with `Component` |
| Tabs | `TabsComponent` | Ends with `Component` |
| TabsTrigger | `TabsTriggerComponent` | Ends with `Component` |

## Sub-components

Sub-components follow the same pattern:
- `AlertDialogTriggerComponent`
- `AlertDialogContentComponent`
- `AlertDialogHeaderComponent`
- `AlertDialogFooterComponent`
- `AlertDialogTitleComponent`
- `AlertDialogDescriptionComponent`
- `AlertDialogActionComponent`
- `AlertDialogCancelComponent`
