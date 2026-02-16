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
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50]` | Page size options |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `onPageNumberChange` | `EventEmitter<number>` | Emitted when page number changes |
| `onPageSizeChange` | `EventEmitter<number>` | Emitted when page size changes |

## Basic Usage

### Simple Pagination

```html
<pagination-component
  [totalRecords]="100"
  [currentPageSize]="10"
  [currentPage]="1"
></pagination-component>
```

### Pagination with Event Handling

```html
<pagination-component
  [totalRecords]="totalRecords"
  [currentPageSize]="pageSize"
  [currentPage]="currentPage"
  (onPageNumberChange)="onPageChange($event)"
  (onPageSizeChange)="onPageSizeChange($event)"
></pagination-component>
```

```typescript
onPageChange(page: number) {
  this.currentPage = page;
  this.loadPage();
}

onPageSizeChange(size: number) {
  this.pageSize = size;
  this.currentPage = 1;
  this.loadPage();
}

loadPage() {
  // Load data for current page
}
```

## Pagination Variants

### Minimal Pagination

```html
<pagination-component
  [totalRecords]="100"
  [currentPageSize]="10"
  [currentPage]="1"
  [showPageLinks]="false"
  [showPageOptions]="false"
  [showCurrentPageInfo]="false"
></pagination-component>
```

### Page Links Only

```html
<pagination-component
  [totalRecords]="100"
  [currentPageSize]="10"
  [currentPage]="1"
  [showPageLinks]="true"
  [showPageOptions]="false"
  [showCurrentPageInfo]="false"
></pagination-component>
```

### Page Size Only

```html
<pagination-component
  [totalRecords]="100"
  [currentPageSize]="10"
  [currentPage]="1"
  [showPageLinks]="false"
  [showPageOptions]="true"
  [showCurrentPageInfo]="false"
></pagination-component>
```

### Page Info Only

```html
<pagination-component
  [totalRecords]="100"
  [currentPageSize]="10"
  [currentPage]="1"
  [showPageLinks]="false"
  [showPageOptions]="false"
  [showCurrentPageInfo]="true"
></pagination-component>
```

## Page Size Options

### Custom Page Sizes

```html
<pagination-component
  [totalRecords]="100"
  [currentPageSize]="20"
  [currentPage]="1"
  [pageSizeOptions]="[5, 10, 20, 50, 100]"
></pagination-component>
```

### Smaller Options

```html
<pagination-component
  [totalRecords]="100"
  [currentPageSize]="5"
  [currentPage]="1"
  [pageSizeOptions]="[5, 10, 15]"
></pagination-component>
```

## Custom Page Info Template

### Custom Text

```html
<pagination-component
  [totalRecords]="100"
  [currentPageSize]="10"
  [currentPage]="1"
  [showCurrentPageInfo]="true"
  [currentPageInfoTemplate]="'Showing {{ start }}-{{ end }} of {{ total }} items'"
></pagination-component>
```

### Custom HTML

```html
<pagination-component
  [totalRecords]="100"
  [currentPageSize]="10"
  [currentPage]="1"
  [showCurrentPageInfo]="true"
  [currentPageInfoTemplate]="'Page {{ currentPage }} of {{ totalPages }}'"
></pagination-component>
```

## Pagination with Page Number Limits

### Limited Page Links

```html
<pagination-component
  [totalRecords]="100"
  [currentPageSize]="10"
  [currentPage]="5"
  [showPageLinks]="true"
  [showPageOptions]="false"
></pagination-component>
```

## Pagination in Card

### Data Table with Pagination

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Users</tolle-card-title>
    <tolle-card-description>
      Manage users with pagination
    </tolle-card-description>
  </tolle-card-header>
  <tolle-card-content>
    <div class="rounded-md border">
      <table class="w-full">
        <thead class="bg-muted">
          <tr>
            <th class="p-4">ID</th>
            <th class="p-4">Name</th>
            <th class="p-4">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of currentPageUsers">
            <td class="p-4">{{ user.id }}</td>
            <td class="p-4">{{ user.name }}</td>
            <td class="p-4">{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </tolle-card-content>
  <tolle-card-footer>
    <pagination-component
      [totalRecords]="totalUsers"
      [currentPageSize]="pageSize"
      [currentPage]="currentPage"
      (onPageNumberChange)="onPageChange($event)"
      (onPageSizeChange)="onPageSizeChange($event)"
    ></pagination-component>
  </tolle-card-footer>
</tolle-card>
```

## Pagination with Search

```html
<div class="space-y-4">
  <tolle-input
    placeholder="Search users..."
    [(ngModel)]="searchQuery"
    (ngModelChange)="onSearchChange($event)"
  >
    <i prefix class="ri-search-line"></i>
  </tolle-input>

  <data-list-component
    [data]="filteredData"
    [columns]="columns"
  ></data-list-component>

  <pagination-component
    [totalRecords]="filteredTotal"
    [currentPageSize]="pageSize"
    [currentPage]="currentPage"
    (onPageNumberChange)="onPageChange($event)"
    (onPageSizeChange)="onPageSizeChange($event)"
  ></pagination-component>
</div>
```

## Pagination with Loading State

```html
<div *ngIf="isLoading; else loaded">
  <skeleton-component class="h-10 w-full mb-2" *ngFor="let i of [1, 2, 3, 4, 5]"></skeleton-component>
</div>

<ng-template #loaded>
  <div>
    <data-list-component
      [data]="dataSource"
      [columns]="columns"
    ></data-list-component>

    <pagination-component
      [totalRecords]="totalRecords"
      [currentPageSize]="pageSize"
      [currentPage]="currentPage"
      (onPageNumberChange)="onPageChange($event)"
      (onPageSizeChange)="onPageSizeChange($event)"
    ></pagination-component>
  </div>
</ng-template>
```

## Pagination with Jump to Page

### Input for Page Jump

```html
<div class="flex items-center gap-2">
  <pagination-component
    [totalRecords]="100"
    [currentPageSize]="10"
    [currentPage]="currentPage"
    [showPageLinks]="false"
    [showPageOptions]="false"
    [showCurrentPageInfo]="false"
  ></pagination-component>

  <div class="flex items-center gap-2">
    <label class="text-sm">Go to page:</label>
    <input
      type="number"
      [(ngModel)]="jumpPage"
      (keydown.enter)="jumpToPage()"
      class="w-20 rounded-md border px-2 py-1 text-sm"
      min="1"
      [max]="totalPages"
    />
    <button tolleButton size="sm" (click)="jumpToPage()">Go</button>
  </div>
</div>
```

```typescript
get totalPages(): number {
  return Math.ceil(this.totalRecords / this.pageSize);
}

jumpToPage() {
  if (this.jumpPage >= 1 && this.jumpPage <= this.totalPages) {
    this.currentPage = this.jumpPage;
    this.onPageChange(this.currentPage);
  }
}
```

## Pagination with Page Range Display

### Showing Current Range

```html
<pagination-component
  [totalRecords]="totalRecords"
  [currentPageSize]="pageSize"
  [currentPage]="currentPage"
  [showCurrentPageInfo]="true"
  [currentPageInfoTemplate]="'Page {{ currentPage }} of {{ totalPages }} ({{ startRecord }}-{{ endRecord }} of {{ totalRecords }})'"
></pagination-component>
```

## Pagination Responsive

### Stack on Mobile

```html
<pagination-component
  [totalRecords]="100"
  [currentPageSize]="10"
  [currentPage]="1"
  class="flex flex-col sm:flex-row items-center gap-2"
></pagination-component>
```
