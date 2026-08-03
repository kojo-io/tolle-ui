import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cn } from './utils/cn';
import { PaginationComponent } from './pagination.component';
import { TolleCellDirective } from './tolle-cell.directive';
import { InputComponent } from './input.component';
import { PopoverComponent } from './popover.component';
import { PopoverContentComponent } from './popover-content.component';
import { CheckboxComponent } from './checkbox.component';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  class?: string;
}

@Component({
  selector: 'tolle-data-table',
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        display: table;
      }
      thead {
        display: table-header-group;
      }
      tbody {
        display: table-row-group;
      }
      tr {
        display: table-row;
      }
      th,
      td {
        display: table-cell;
      }
    `,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    InputComponent,
    PopoverComponent,
    PopoverContentComponent,
    CheckboxComponent,
  ],
  template: `
    <div class="flex h-full w-full flex-col">
      <div class="flex flex-none items-center justify-between py-2">
        @if (searchable) {
          <div class="w-full max-w-sm">
            <tolle-input
              [size]="size === 'lg' ? 'default' : 'sm'"
              class="w-full"
              aria-label="Filter records"
              placeholder="Filter records..."
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearch()">
              <i prefix class="ri-search-line"></i>
            </tolle-input>
          </div>
        }

        @if (allowColumnHiding && showSettings) {
          <tolle-popover class="ml-auto">
            <button
              trigger
              [class]="
                cn(
                  'ml-auto flex items-center gap-2 rounded-md border border-input bg-background px-3 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring',
                  size === 'xs' ? 'h-7 text-xs' : 'h-9 text-sm'
                )
              ">
              <i class="ri-settings-3-line"></i>
              View
              <i class="ri-arrow-down-s-line ml-1 opacity-50"></i>
            </button>
            <tolle-popover-content class="w-56 border-border bg-background p-0">
              <div class="border-b border-border p-2">
                <p class="px-2 text-xs font-medium text-muted-foreground">Toggle Columns</p>
              </div>
              <div class="max-h-[300px] space-y-1 overflow-y-auto p-2">
                @for (col of columns; track col) {
                  <label
                    class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent">
                    <tolle-checkbox
                      [ngModel]="columnVisibility[col.key]"
                      (ngModelChange)="toggleColumn(col.key)" />
                    <span>{{ col.label }}</span>
                  </label>
                }
              </div>
            </tolle-popover-content>
          </tolle-popover>
        }
      </div>

      <div
        [class]="
          cn(
            'relative min-h-0 w-full flex-1 overflow-hidden',
            bordered ? 'rounded-md border border-border' : '',
            tableBackground
          )
        ">
        <div class="h-full w-full overflow-auto" [style.max-height]="maxHeight">
          <table class="w-full table-auto border-collapse">
            <thead [class]="cn('border-b border-border', resolvedHeaderBackground)">
              <tr>
                @if (expandable) {
                  <th
                    scope="col"
                    [class]="
                      cn(
                        'px-4',
                        size === 'xs' ? 'w-[32px]' : 'w-[48px]',
                        stickyHeader ? 'sticky top-0 z-10 ' + resolvedHeaderBackground : ''
                      )
                    "></th>
                }

                @for (col of activeColumns; track col) {
                  <th
                    scope="col"
                    [attr.aria-sort]="
                      sortKey === col.key
                        ? sortDir === 'asc'
                          ? 'ascending'
                          : sortDir === 'desc'
                            ? 'descending'
                            : 'none'
                        : 'none'
                    "
                    [class]="
                      cn(
                        'text-left font-medium text-foreground',
                        headerPaddingClass,
                        fontSizeClass,
                        col.class,
                        stickyHeader
                          ? 'sticky top-0 z-10 shadow-sm ' + resolvedHeaderBackground
                          : ''
                      )
                    ">
                    @if (col.sortable) {
                      <button
                        type="button"
                        (click)="toggleSort(col.key)"
                        class="flex cursor-pointer select-none items-center gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {{ col.label }}
                        <i [class]="getSortIcon(col.key)" aria-hidden="true"></i>
                      </button>
                    } @else {
                      {{ col.label }}
                    }
                  </th>
                }
              </tr>
            </thead>

            <tbody class="divide-y divide-border">
              @for (row of pagedData; track row; let i = $index) {
                <tr
                  [class]="cn('transition-colors', getRowBackground(row, i), 'hover:bg-muted/50')">
                  @if (expandable) {
                    <td class="px-4">
                      <button
                        (click)="toggleRow(i)"
                        [attr.aria-label]="expandedRows.has(i) ? 'Collapse row' : 'Expand row'"
                        [attr.aria-expanded]="expandedRows.has(i)"
                        [class]="
                          cn(
                            'rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            size === 'xs' ? 'h-6 w-6' : 'h-8 w-8'
                          )
                        ">
                        <i
                          [class]="
                            expandedRows.has(i) ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'
                          "
                          aria-hidden="true">
                        </i>
                      </button>
                    </td>
                  }
                  @for (col of activeColumns; track col) {
                    <td [class]="cn('align-middle', cellPaddingClass, fontSizeClass, col.class)">
                      @if (getTemplate(col.key); as cell) {
                        <ng-container
                          *ngTemplateOutlet="
                            cell.template;
                            context: { $implicit: row[col.key], row: row }
                          ">
                        </ng-container>
                      } @else {
                        {{ row[col.key] }}
                      }
                    </td>
                  }
                </tr>
                @if (expandedRows.has(i)) {
                  <tr class="bg-muted/10">
                    <td [attr.colspan]="activeColumns.length + (expandable ? 1 : 0)" class="p-0">
                      <div class="border-t border-dashed border-border p-6">
                        @if (expandedTemplate) {
                          <ng-container *ngTemplateOutlet="expandedTemplate; context: { row: row }">
                          </ng-container>
                        } @else {
                          <p class="text-xs italic text-muted-foreground">No details available.</p>
                        }
                      </div>
                    </td>
                  </tr>
                }
              }

              @if (pagedData.length === 0) {
                <tr>
                  <td
                    [attr.colspan]="activeColumns.length + (expandable ? 1 : 0)"
                    class="h-24 text-center text-muted-foreground">
                    No results found.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex-none">
        @if (paginate && filteredData.length > 0) {
          <tolle-pagination
            [totalRecords]="filteredData.length"
            [pageSizeOptions]="pageSizeOptions"
            [currentPage]="currentPage"
            [currentPageSize]="pageSize"
            (onPageNumberChange)="handlePageChange($event)"
            (onPageSizeChange)="handlePageSizeChange($event)"></tolle-pagination>
        }
      </div>
    </div>
  `,
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() searchable = true;
  @Input() paginate = true;
  @Input() pageSizeOptions: number[] = [];
  @Input() pageSize = 10;
  @Input() expandable = false;

  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  @Input() stickyHeader = false;
  @Input() maxHeight?: string;

  // Draws a physical border around the table itself (not the whole component).
  @Input() bordered = true;

  // --- Background Colors ---
  // All of these take Tailwind class strings (e.g. 'bg-card', 'bg-muted/40') so
  // they stay theme-token aware and follow dark mode, matching `col.class`.

  /** Background for the table surface, behind both header and rows. */
  @Input() tableBackground = '';

  /**
   * Background for the header row. Must be opaque when `stickyHeader` is on,
   * otherwise rows scroll visibly through the header — hence the default
   * `bg-background` rather than transparent.
   */
  @Input() headerBackground = 'bg-background';

  /** Alternating row backgrounds. Applied to odd rows only. */
  @Input() striped = false;

  /** Background applied to odd rows when `striped` is on. */
  @Input() stripeBackground = 'bg-muted/30';

  /**
   * Per-row background, resolved against the row's own data — e.g.
   * `[rowBackground]="r => r.overdue ? 'bg-destructive/10' : ''"`.
   * Takes precedence over `striped`.
   */
  @Input() rowBackground?: (row: any, index: number) => string;

  /**
   * A sticky header with no background lets rows scroll visibly through it, so
   * fall back to an opaque default if a consumer clears `headerBackground`.
   */
  get resolvedHeaderBackground(): string {
    if (this.stickyHeader && !this.headerBackground) return 'bg-background';
    return this.headerBackground;
  }

  /** Resolves the background for a body row: per-row callback wins over striping. */
  getRowBackground(row: any, index: number): string {
    const custom = this.rowBackground?.(row, index);
    if (custom) return custom;
    return this.striped && index % 2 === 1 ? this.stripeBackground : '';
  }

  // --- Column Hiding Settings ---
  @Input() allowColumnHiding = true;
  @Input() showSettings = true;

  // Track visibility state
  columnVisibility: Record<string, boolean> = {};

  // Filters columns based on visibility state
  get activeColumns() {
    return this.columns.filter(col => this.columnVisibility[col.key]);
  }

  expandedRows = new Set<number>();
  @ContentChildren(TolleCellDirective) cellTemplates!: QueryList<TolleCellDirective>;
  @Input() expandedTemplate?: TemplateRef<any>;

  filteredData: any[] = [];
  pagedData: any[] = [];
  searchTerm = '';
  currentPage = 1;
  sortKey = '';
  sortDir: 'asc' | 'desc' | null = null;

  // Style Getters
  get cellPaddingClass(): string {
    switch (this.size) {
      case 'xs':
        return 'p-1 px-4';
      case 'sm':
        return 'p-2 px-4';
      case 'lg':
        return 'p-6 px-4';
      default:
        return 'p-4';
    }
  }

  get headerPaddingClass(): string {
    switch (this.size) {
      case 'xs':
        return 'h-7 px-4';
      case 'sm':
        return 'h-9 px-4';
      case 'lg':
        return 'h-14 px-4';
      default:
        return 'h-12 px-4';
    }
  }

  get fontSizeClass(): string {
    switch (this.size) {
      case 'xs':
        return 'text-[11px]';
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  }

  protected cn = cn;

  ngOnInit() {
    this.initializeVisibility();
    this.refreshTable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.currentPage = 1; // Reset to page 1 when data changes
      this.refreshTable();
    }
    if (changes['columns']) {
      this.initializeVisibility();
    }
  }

  private initializeVisibility() {
    this.columns.forEach(col => {
      // Only set true if undefined, preserves user selection on other data refreshes
      if (this.columnVisibility[col.key] === undefined) {
        this.columnVisibility[col.key] = true;
      }
    });
  }

  refreshTable() {
    this.applySearch();
    this.applySort();
    this.updatePage();
  }
  onSearch() {
    this.currentPage = 1;
    this.refreshTable();
  }

  // Toggle function used by the checkbox in popover
  toggleColumn(key: string) {
    this.columnVisibility[key] = !this.columnVisibility[key];
    // No explicit refresh needed as the getter 'activeColumns' will automatically re-evaluate
    // when change detection runs after the click event.
  }

  private applySearch() {
    if (!this.searchTerm) {
      this.filteredData = [...this.data];
      return;
    }
    const q = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(row =>
      Object.values(row).some(val => String(val).toLowerCase().includes(q))
    );
  }

  private applySort() {
    if (!this.sortKey || !this.sortDir) return;
    this.filteredData.sort((a, b) => {
      const valA = a[this.sortKey];
      const valB = b[this.sortKey];
      if (valA < valB) return this.sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  handlePageChange(newPage: number) {
    this.currentPage = newPage;
    this.updatePage();
  }

  handlePageSizeChange(newSize: number) {
    if (newSize !== this.pageSize) {
      this.pageSize = newSize;
      this.currentPage = 1; // Reset to page 1 when size changes
      this.updatePage();
    }
  }

  updatePage() {
    if (!this.paginate) {
      this.pagedData = this.filteredData;
      return;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    // Safety check if current page is out of bounds after filtering
    if (start >= this.filteredData.length && this.currentPage > 1) {
      this.currentPage = 1;
      this.updatePage();
      return;
    }

    this.pagedData = this.filteredData.slice(start, end);
  }

  toggleSort(key: string) {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : this.sortDir === 'desc' ? null : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
    this.currentPage = 1; // Reset to page 1 when sorting
    this.refreshTable();
  }

  getSortIcon(key: string) {
    if (this.sortKey !== key || !this.sortDir) return 'ri-expand-up-down-line opacity-20'; // Changed icon for inactive state
    return this.sortDir === 'asc'
      ? 'ri-arrow-up-line text-foreground'
      : 'ri-arrow-down-line text-foreground';
  }

  toggleRow(index: number) {
    if (this.expandedRows.has(index)) {
      this.expandedRows.delete(index);
    } else {
      this.expandedRows.add(index);
    }
  }

  getTemplate(key: string): TolleCellDirective | undefined {
    return this.cellTemplates?.find(t => t.name === key);
  }
}
