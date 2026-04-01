# Dropdown Trigger Directive Usage Guide

## Overview

The Dropdown Trigger directive provides a simple way to trigger dropdown menus with automatic positioning using Floating UI. It works in conjunction with the DropdownMenuComponent by binding to a DropdownMenuComponent instance.

## Import

```typescript
import {
  DropdownTriggerDirective,
  DropdownMenuComponent
} from '@tolle_/tolle-ui';
```

## Directive

### DropdownTriggerDirective

Selector: `[tolleDropdownTrigger]`

**Inputs:**

| Input | Type | Description |
|-------|------|-------------|
| `tolleDropdownTrigger` | `DropdownMenuComponent` | The dropdown menu component instance to trigger |

**Note:** This directive does not emit events directly. Use the dropdown menu's events for interaction handling.

## Basic Usage

```html
<tolle-button variant="outline" [tolleDropdownTrigger]="myMenu">
  Options
</tolle-button>

<tolle-dropdown-menu #myMenu>
  <tolle-dropdown-item>Edit</tolle-dropdown-item>
  <tolle-dropdown-item>Delete</tolle-dropdown-item>
</tolle-dropdown-menu>
```
