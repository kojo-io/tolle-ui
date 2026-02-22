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

### Simple Data Table

```typescript
// Component
dataSource = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' }
];

columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' }
];
```

```html
<tolle-data-table
  [data]="dataSource"
  [columns]="columns"
></tolle-data-table>
```

### Data Table with Pagination

```html
<tolle-data-table
  [data]="dataSource"
  [columns]="columns"
  [pageSize]="10"
></tolle-data-table>

<tolle-pagination
  [totalRecords]="totalRecords"
  [currentPageSize]="10"
  [currentPage]="currentPage"
  (onPageNumberChange)="onPageChange($event)"
  (onPageSizeChange)="onPageSizeChange($event)"
></tolle-pagination>
```

## Column Definitions

### Basic Columns

```typescript
columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];
```

### Custom Cell Template

```html
<tolle-data-table
  [data]="dataSource"
  [columns]="columns"
>
  <ng-template #cellActions let-row>
    <button tolle-button variant="ghost" size="sm">
      <i class="ri-edit-line"></i>
    </button>
    <button tolle-button variant="ghost" size="sm" class="text-destructive">
      <i class="ri-delete-bin-line"></i>
    </button>
  </ng-template>
</tolle-data-table>
```

### Custom Header Template

```html
<tolle-data-table
  [data]="dataSource"
  [columns]="columns"
>
  <ng-template #headerName>
    <div class="flex items-center gap-2">
      <span>Name</span>
      <i class="ri-arrow-up-line"></i>
    </div>
  </ng-template>
</tolle-data-table>
```

## Sorting

### Sortable Columns

```html
<tolle-data-table
  [data]="dataSource"
  [columns]="columns"
  [sortable]="true"
  (onSortChange)="onSortChange($event)"
></tolle-data-table>
```

```typescript
onSortChange(sort: { key: string; direction: 'asc' | 'desc' }) {
  // Handle sorting
  this.dataSource = this.dataSource.sort((a, b) => {
    const aValue = a[sort.key];
    const bValue = b[sort.key];
    if (sort.direction === 'asc') {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });
}
```

## Pagination

### Pagination with Page Size Options

```html
<tolle-pagination
  [totalRecords]="totalRecords"
  [currentPageSize]="pageSize"
  [currentPage]="currentPage"
  [pageSizeOptions]="[5, 10, 20, 50]"
  [showPageLinks]="true"
  [showPageOptions]="true"
  [showCurrentPageInfo]="true"
  (onPageNumberChange)="onPageChange($event)"
  (onPageSizeChange)="onPageSizeChange($event)"
></tolle-pagination>
```

### Custom Page Info Template

```html
<tolle-pagination
  [totalRecords]="totalRecords"
  [currentPageSize]="pageSize"
  [currentPage]="currentPage"
  [currentPageInfoTemplate]="'Displaying {{ start }}-{{ end }} of {{ total }} items'"
></tolle-pagination>
```

## Table Variants

### Striped Table

```html
<tolle-data-table
  [data]="dataSource"
  [columns]="columns"
  class="data-table-striped"
></tolle-data-table>
```

```css
.data-table-striped tbody tr:nth-child(odd) {
  background-color: var(--muted);
}
```

### Bordered Table

```html
<tolle-data-table
  [data]="dataSource"
  [columns]="columns"
  class="data-table-bordered"
></tolle-data-table>
```

```css
.data-table-bordered {
  border: 1px solid var(--border);
}

.data-table-bordered th,
.data-table-bordered td {
  border: 1px solid var(--border);
}
```

## Data Table with Actions

```html
<tolle-data-table
  [data]="dataSource"
  [columns]="columns"
>
  <ng-template #cellStatus let-row>
    <tolle-badge [variant]="row.status === 'Active' ? 'default' : 'secondary'">
      {{ row.status }}
    </tolle-badge>
  </ng-template>
  <ng-template #cellActions let-row>
    <div class="flex items-center gap-2">
      <button
        tolle-button
        variant="ghost"
        size="sm"
        (click)="editRow(row)"
      >
        <i class="ri-edit-line"></i>
      </button>
      <button
        tolle-button
        variant="ghost"
        size="sm"
        class="text-destructive"
        (click)="deleteRow(row.id)"
      >
        <i class="ri-delete-bin-line"></i>
      </button>
    </div>
  </ng-template>
</tolle-data-table>
```

## Data Table in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Users</tolle-card-title>
    <tolle-card-description>
      Manage your application users
    </tolle-card-description>
  </tolle-card-header>
  <tolle-card-content>
    <tolle-data-table
      [data]="users"
      [columns]="userColumns"
    ></tolle-data-table>
  </tolle-card-content>
  <tolle-card-footer>
    <tolle-pagination
      [totalRecords]="totalUsers"
      [currentPageSize]="pageSize"
      [currentPage]="currentPage"
      (onPageNumberChange)="onPageChange($event)"
      (onPageSizeChange)="onPageSizeChange($event)"
    ></tolle-pagination>
  </tolle-card-footer>
</tolle-card>
```

## Data Table with Search

```html
<div class="space-y-4">
  <div class="flex items-center gap-2">
    <tolle-input
      placeholder="Search users..."
      [(ngModel)]="searchQuery"
      (ngModelChange)="onSearchChange($event)"
    >
      <i prefix class="ri-search-line"></i>
    </tolle-input>
  </div>

  <tolle-data-table
    [data]="filteredData"
    [columns]="columns"
  ></tolle-data-table>
</div>
```

## Data Table Loading State

```html
<div *ngIf="isLoading; else loadedTable">
  <tolle-skeleton class="h-10 w-full mb-2" *ngFor="let i of [1, 2, 3, 4, 5]"></tolle-skeleton>
</div>

<ng-template #loadedTable>
  <tolle-data-table
    [data]="dataSource"
    [columns]="columns"
  ></tolle-data-table>
</ng-template>
```
