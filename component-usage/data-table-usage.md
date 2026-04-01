# Data Table Component Usage Guide

## Overview

The DataTableComponent provides a data table with sorting and pagination capabilities for displaying structured data.

## Import

```typescript
import { DataTableComponent, PaginationComponent } from '@tolle_/tolle-ui';
```

## Components

### DataTableComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `data` | `any[]` | `[]` | Table data array |
| `columns` | `any[]` | `[]` | Column definitions |
| `sortable` | `boolean` | `true` | Enable sorting |
| `page` | `number` | `1` | Current page |
| `pageSize` | `number` | `10` | Number of items per page |

### PaginationComponent

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
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50]` | Page size options |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `onPageNumberChange` | `EventEmitter<number>` | Emitted when page number changes |
| `onPageSizeChange` | `EventEmitter<number>` | Emitted when page size changes |

## Basic Usage

### Base Table

```html
<tolle-data-table [columns]="columns" [searchable]="false" [data]="users" [allowColumnHiding]="false"
  [paginate]="false">
  <ng-template tolleCell="actions" let-row="row">
    <tolle-button size="xs">Edit</tolle-button>
  </ng-template>
</tolle-data-table>
```

### Column Hiding

```html
<tolle-data-table [columns]="columns"
                  [searchable]="false"
                  [data]="users"
                  [allowColumnHiding]="true"
                  [paginate]="false">
  <ng-template tolleCell="actions" let-row="row">
    <tolle-button size="xs">Edit</tolle-button>
  </ng-template>
</tolle-data-table>
```

### Data Table Standard

```html
<tolle-data-table [columns]="columns" [data]="users" [pageSize]="5" [pageSizeOptions]="[5, 10, 15, 20, 25, 50]">
  <ng-template tolleCell="actions" let-row="row">
    <tolle-button size="xs">Edit</tolle-button>
  </ng-template>
</tolle-data-table>
```

### Data Table Sticky

```html
<tolle-data-table [data]="data" [columns]="columns" [stickyHeader]="true" [maxHeight]="maxHeight" class="h-full w-full">
</tolle-data-table>
```

### Pagination Example

```html
<tolle-data-table [columns]="columns"
                  [searchable]="false"
                  [data]="users"
                  [allowColumnHiding]="true"
                  [pageSize]="5"
                  [pageSizeOptions]="[5, 10, 15, 20 , 25, 50]"
                  [paginate]="true">
  <ng-template tolleCell="actions" let-row="row">
    <tolle-button size="xs">Edit</tolle-button>
  </ng-template>
</tolle-data-table>
```

### Searchable

```html
<tolle-data-table [columns]="columns"
                  [searchable]="true"
                  [data]="users"
                  [allowColumnHiding]="true"
                  [pageSize]="5"
                  [pageSizeOptions]="[5, 10, 15, 20 , 25, 50]"
                  [paginate]="true">
  <ng-template tolleCell="actions" let-row="row">
    <tolle-button size="xs">Edit</tolle-button>
  </ng-template>
</tolle-data-table>
```

### Sticky

```html
<tolle-data-table [columns]="columns" [data]="users" [stickyHeader]="true" maxHeight="300px">
</tolle-data-table>
```

