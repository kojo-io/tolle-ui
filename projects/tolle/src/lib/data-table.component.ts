import {
  Component, Input, OnInit, OnChanges, SimpleChanges,
  TemplateRef, ContentChildren, QueryList
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cn } from './utils/cn';
import {PaginationComponent} from './pagination.component';
import {TolleCellDirective} from './tolle-cell.directive';
import {InputComponent} from './input.component';
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  class?: string;
}

@Component({
  selector: 'tolle-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, InputComponent],
  template: `
    <div class="space-y-4">
      <div *ngIf="searchable" class="flex items-center py-2">
        <tolle-input
          [size]="size === 'lg' ? 'default' : 'sm'"
          class="max-w-sm"
          placeholder="Filter records..."
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch()">
          <i prefix class="ri-search-line"></i>
        </tolle-input>
      </div>

      <div class="rounded-md border border-border overflow-hidden shadow-sm">
        <table class="w-full text-sm">
          <thead class="border-b bg-muted/30">
            <tr>
              <th *ngIf="expandable" [class]="cn('px-4', size === 'xs' ? 'w-[32px]' : 'w-[48px]')"></th>
              <th *ngFor="let col of columns"
                  [class]="cn(
                  'font-medium text-muted-foreground transition-all',
                  headerPaddingClass,
                  fontSizeClass,
                  col.class
                )">
                <div *ngIf="col.sortable; else simpleHeader" (click)="toggleSort(col.key)" class="flex items-center gap-1 cursor-pointer hover:text-foreground">
                  {{ col.label }}
                  <i [class]="getSortIcon(col.key)"></i>
                </div>
                <ng-template #simpleHeader>{{ col.label }}</ng-template>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <ng-container *ngFor="let row of pagedData; let i = index">
              <tr class="hover:bg-muted/50 transition-colors">
                <td *ngIf="expandable" class="px-4">
                  <button (click)="toggleRow(i)"
                          [class]="cn(
                      'flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground',
                      size === 'xs' ? 'h-6 w-6' : 'h-8 w-8'
                    )">
                    <i [class]="expandedRows.has(i) ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'"></i>
                  </button>
                </td>

                <td *ngFor="let col of columns"
                    [class]="cn(
                    'align-middle transition-all',
                    cellPaddingClass,
                    fontSizeClass,
                    col.class
                  )">
                  <ng-container *ngIf="getTemplate(col.key) as cell; else defaultValue">
                    <ng-container *ngTemplateOutlet="cell.template; context: { $implicit: row[col.key], row: row }"></ng-container>
                  </ng-container>
                  <ng-template #defaultValue>
                    <span class="text-foreground">{{ row[col.key] }}</span>
                  </ng-template>
                </td>
              </tr>

              <tr *ngIf="expandedRows.has(i)" class="bg-muted/10">
                <td [attr.colspan]="columns.length + (expandable ? 1 : 0)" class="p-0">
                   <div class="p-6 border-b border-dashed border-border">
                      <ng-container *ngIf="expandedTemplate; else defaultExpanded">
                        <ng-container *ngTemplateOutlet="expandedTemplate; context: { row: row }"></ng-container>
                      </ng-container>
                      <ng-template #defaultExpanded>
                        <div class="text-xs text-muted-foreground italic">No details available.</div>
                      </ng-template>
                   </div>
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>

      <tolle-pagination
        *ngIf="paginate"
        [totalRecords]="filteredData.length"
        [currentPage]="currentPage"
        [currentPageSize]="pageSize"
        (onPageNumberChange)="updatePage()"
        (onPageSizeChange)="updatePage()"
      ></tolle-pagination>
    </div>
  `
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() searchable = true;
  @Input() paginate = true;
  @Input() pageSize = 10;
  @Input() expandable = false;
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';

  // --- NEW INPUTS FOR COLUMN HIDING ---
  @Input() allowColumnHiding = true;
  @Input() showSettings = true; // Set to false to hide the gear icon/menu entirely

  // Track visibility state: { 'columnKey': true/false }
  columnVisibility: Record<string, boolean> = {};
  showColumnMenu = false;

  // Filter columns based on visibility state
  get activeColumns() {
    return this.columns.filter(col => this.columnVisibility[col.key]);
  }

  // Track which rows are open
  expandedRows = new Set<number>();

  // Use ContentChildren to grab the tolleCell templates from the user's HTML
  @ContentChildren(TolleCellDirective) cellTemplates!: QueryList<TolleCellDirective>;

  // Keep this as an Input for the main expansion slot
  @Input() expandedTemplate?: TemplateRef<any>;

  filteredData: any[] = [];
  pagedData: any[] = [];
  searchTerm = '';
  currentPage = 1;
  sortKey = '';
  sortDir: 'asc' | 'desc' | null = null;

  // 2. Map Size to Padding for Cells
  get cellPaddingClass(): string {
    switch (this.size) {
      case 'xs': return 'p-1 px-4';    // Ultra-compact
      case 'sm': return 'p-2 px-4';    // Dense
      case 'lg': return 'p-6 px-4';    // Spacious
      default:   return 'p-4';         // Standard (16px)
    }
  }

  // 3. Map Size to Padding for Header (usually slightly shorter than cells)
  get headerPaddingClass(): string {
    switch (this.size) {
      case 'xs': return 'h-7 px-4';
      case 'sm': return 'h-9 px-4';
      case 'lg': return 'h-14 px-4';
      default:   return 'h-12 px-4';
    }
  }

  // 4. Map Size to Font Sizes
  get fontSizeClass(): string {
    switch (this.size) {
      case 'xs': return 'text-[11px]';
      case 'sm': return 'text-xs';
      case 'lg': return 'text-base';
      default:   return 'text-sm';
    }
  }

  protected cn = cn;

  ngOnInit() { this.refreshTable(); }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) { this.refreshTable(); }
    if (changes['columns']) { this.initializeVisibility(); }
  }

  private initializeVisibility() {
    // Default all columns to visible if not already set
    this.columns.forEach(col => {
      if (this.columnVisibility[col.key] === undefined) {
        this.columnVisibility[col.key] = true;
      }
    });
  }

  // --- Search & Sort & Page Logic ---
  // (Your existing implementation of applySearch, applySort, and updatePage goes here)
  refreshTable() { this.applySearch(); this.applySort(); this.updatePage(); }
  onSearch() { this.currentPage = 1; this.refreshTable(); }

  toggleColumn(key: string) {
    this.columnVisibility[key] = !this.columnVisibility[key];
  }

  private applySearch() {
    if (!this.searchTerm) { this.filteredData = [...this.data]; return; }
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

  updatePage() {
    if (!this.paginate) { this.pagedData = this.filteredData; return; }
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.filteredData.slice(start, end);
  }

  // --- Helpers ---
  toggleSort(key: string) {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : this.sortDir === 'desc' ? null : 'asc';
    } else { this.sortKey = key; this.sortDir = 'asc'; }
    this.refreshTable();
  }

  getSortIcon(key: string) {
    if (this.sortKey !== key || !this.sortDir) return 'ri-arrow-up-down-line opacity-30';
    return this.sortDir === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line';
  }

  toggleRow(index: number) {
    if (this.expandedRows.has(index)) this.expandedRows.delete(index);
    else this.expandedRows.add(index);
  }

  // Helper to find the right cell template
  getTemplate(key: string): TolleCellDirective | undefined {
    return this.cellTemplates?.find(t => t.name === key);
  }
}
