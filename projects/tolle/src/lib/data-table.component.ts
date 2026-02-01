import {
  Component, Input, OnInit, OnChanges, SimpleChanges,
  TemplateRef, ContentChildren, QueryList
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
  standalone: true,
  styles: [`
    :host { display: block; width: 100%; }
    table { width: 100%; border-collapse: collapse; display: table; }
    thead { display: table-header-group; }
    tbody { display: table-row-group; }
    tr { display: table-row; }
    th, td { display: table-cell; }
  `],
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
    <div class="space-y-4 w-full">
      <div class="flex items-center justify-between py-2">
        <div *ngIf="searchable" class="w-full max-w-sm">
          <tolle-input
            [size]="size === 'lg' ? 'default' : 'sm'"
            class="w-full"
            placeholder="Filter records..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearch()">
            <i prefix class="ri-search-line"></i>
          </tolle-input>
        </div>

        <tolle-popover *ngIf="allowColumnHiding && showSettings">
          <button trigger
                  [class]="cn(
              'ml-auto flex items-center gap-2 rounded-md border border-input bg-background px-3 hover:bg-accent hover:text-accent-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
              size === 'xs' ? 'h-7 text-xs' : 'h-9 text-sm'
            )">
            <i class="ri-settings-3-line"></i>
            View
            <i class="ri-arrow-down-s-line ml-1 opacity-50"></i>
          </button>
          <tolle-popover-content class="w-56 p-0 bg-background border-border">
            <div class="p-2 border-b border-border">
              <p class="text-xs font-medium text-muted-foreground px-2">Toggle Columns</p>
            </div>
            <div class="p-2 max-h-[300px] overflow-y-auto space-y-1">
              <label *ngFor="let col of columns" class="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer text-sm transition-colors">
                <tolle-checkbox [ngModel]="columnVisibility[col.key]"
                                (ngModelChange)="toggleColumn(col.key)"/>
                <span>{{ col.label }}</span>
              </label>
            </div>
          </tolle-popover-content>
        </tolle-popover>
      </div>

      <div class="rounded-md border border-border overflow-hidden shadow-sm relative w-full">
        <div class="overflow-auto w-full">

          <table class="w-full table-auto border-collapse">
            <thead class="border-b border-border bg-background">
            <tr>
              <th *ngIf="expandable" [class]="cn('px-4', size === 'xs' ? 'w-[32px]' : 'w-[48px]')"></th>

              <th *ngFor="let col of activeColumns"
                  [class]="cn('text-left font-medium text-foreground',headerPaddingClass,fontSizeClass, col.class)">

                <div *ngIf="col.sortable; else plainHeader"
                     (click)="toggleSort(col.key)"
                     class="flex items-center gap-1 cursor-pointer select-none">
                  {{ col.label }}
                  <i [class]="getSortIcon(col.key)"></i>
                </div>

                <ng-template #plainHeader>
                  {{ col.label }}
                </ng-template>
              </th>
            </tr>
            </thead>

            <tbody class="divide-y divide-border">
            <ng-container *ngFor="let row of pagedData; let i = index">
              <tr class="hover:bg-muted/50 transition-colors">
                <td *ngIf="expandable" class="px-4">
                  <button (click)="toggleRow(i)"
                          [class]="cn(
                      'rounded-md hover:bg-accent transition-colors',
                      size === 'xs' ? 'h-6 w-6' : 'h-8 w-8'
                    )">
                    <i [class]="expandedRows.has(i)
                ? 'ri-arrow-down-s-line'
                : 'ri-arrow-right-s-line'">
                    </i>
                  </button>
                </td>

                <td *ngFor="let col of activeColumns"
                    [class]="cn('align-middle',cellPaddingClass,fontSizeClass,col.class)">

                  <ng-container *ngIf="getTemplate(col.key) as cell; else defaultCell">
                    <ng-container
                      *ngTemplateOutlet="cell.template; context: { $implicit: row[col.key], row: row }">
                    </ng-container>
                  </ng-container>

                  <ng-template #defaultCell>
                    {{ row[col.key] }}
                  </ng-template>
                </td>
              </tr>

              <tr *ngIf="expandedRows.has(i)" class="bg-muted/10">
                <td [attr.colspan]="activeColumns.length + (expandable ? 1 : 0)"
                    class="p-0">
                  <div class="p-6 border-t border-dashed border-border">
                    <ng-container *ngIf="expandedTemplate; else noExpanded">
                      <ng-container
                        *ngTemplateOutlet="expandedTemplate; context: { row: row }">
                      </ng-container>
                    </ng-container>

                    <ng-template #noExpanded>
                      <p class="text-xs text-muted-foreground italic">
                        No details available.
                      </p>
                    </ng-template>
                  </div>
                </td>
              </tr>
            </ng-container>

            <tr *ngIf="pagedData.length === 0">
              <td [attr.colspan]="activeColumns.length + (expandable ? 1 : 0)"
                  class="h-24 text-center text-muted-foreground">
                No results found.
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <tolle-pagination
        *ngIf="paginate && filteredData.length > 0"
        [totalRecords]="filteredData.length"
        [pageSizeOptions]="pageSizeOptions"
        [currentPage]="currentPage"
        [currentPageSize]="pageSize"
        (onPageNumberChange)="handlePageChange($event)"
        (onPageSizeChange)="handlePageSizeChange($event)"
      ></tolle-pagination>
    </div>
  `
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() searchable = true;
  @Input() paginate = true;
  @Input() pageSizeOptions: number[] = []
  @Input() pageSize = 10;
  @Input() expandable = false;
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';

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
      case 'xs': return 'p-1 px-4';
      case 'sm': return 'p-2 px-4';
      case 'lg': return 'p-6 px-4';
      default: return 'p-4';
    }
  }

  get headerPaddingClass(): string {
    switch (this.size) {
      case 'xs': return 'h-7 px-4';
      case 'sm': return 'h-9 px-4';
      case 'lg': return 'h-14 px-4';
      default: return 'h-12 px-4';
    }
  }

  get fontSizeClass(): string {
    switch (this.size) {
      case 'xs': return 'text-[11px]';
      case 'sm': return 'text-xs';
      case 'lg': return 'text-base';
      default: return 'text-sm';
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
      this.filteredData =
        [...this.data];
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
      const valA = a[this.sortKey]; const valB = b[this.sortKey];
      if (valA < valB) return this.sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  handlePageChange(newPage: number) {
    console.log('Page Change Event Triggered:', newPage); // <--- Add this
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
    return this.sortDir === 'asc' ? 'ri-arrow-up-line text-foreground' : 'ri-arrow-down-line text-foreground';
  }

  toggleRow(index: number) {
    if (this.expandedRows.has(index)) {
      this.expandedRows.delete(index);
    }
    else {
      this.expandedRows.add(index);
    }
  }

  getTemplate(key: string): TolleCellDirective | undefined {
    return this.cellTemplates?.find(t => t.name === key);
  }
}
