# Pagination Component Usage Guide

## Overview

The Pagination component provides navigation controls for paginated data. It supports customizing page size, displaying page numbers, and showing current page information.

## Import

```typescript
import { PaginationComponent } from '@tolle_/tolle-ui';
```

## PaginationComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `showPageLinks` | `boolean` | `true` | Show page number links |
| `showPageOptions` | `boolean` | `true` | Show page size options |
| `showCurrentPageInfo` | `boolean` | `true` | Show current page info |
| `currentPageInfoTemplate` | `string` | - | Custom page info template |
| `totalRecords` | `number` | `0` | Total record count |
| `currentPageSize` | `number` | `10` | Current page size |
| `currentPage` | `number` | `1` | Current page number |
| `pageSizeOptions` | `number[]` | `[10, 20, 30, 50]` | Page size options |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `onPageNumberChange` | `EventEmitter<number>` | Emitted when page number changes |
| `onPageSizeChange` | `EventEmitter<number>` | Emitted when page size changes |

## Basic Usage

### Basic Pagination Example

```html
<div class="w-full flex flex-col gap-4">
      <tolle-pagination
        [totalRecords]="100"
        [currentPage]="page"
        [currentPageSize]="10"
        (onPageNumberChange)="onPageChange($event)"
      ></tolle-pagination>

      <div class="text-sm text-muted-foreground mt-4 text-center">
        Current Page: <span class="font-mono text-foreground">{{ page }}</span>
      </div>
    </div>
```

