import {
  Component, input, computed, signal, contentChildren,
  TemplateRef, model, effect, untracked
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
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    InputComponent,
    PopoverComponent,
    PopoverContentComponent,
    CheckboxComponent,
  ],
  styles: [`
    :host { display: block; width: 100%; }
    table { width: 100%; border-collapse: collapse; display: table; }
    thead { display: table-header-group; }
    tbody { display: table-row-group; }
    tr { display: table-row; }
    th, td { display: table-cell; }
  `],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between py-2">
        @if (searchable()) {
          <div class="w-full max-w-sm">
            <tolle-input
              [size]="size() === 'lg' ? 'default' : 'sm'"
              class="w-full"
              placeholder="Filter records..."
              [ngModel]="searchTerm()"
              (ngModelChange)="searchTerm.set($event)">
              <i prefix class="ri-search-line"></i>
            </tolle-input>
          </div>
        }

        @if (allowColumnHiding() && showSettings()) {
          <tolle-popover>
            <button trigger
                  [class]="cn(
              'ml-auto flex items-center gap-2 rounded-md border border-input bg-background px-3 hover:bg-accent hover:text-accent-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
              size() === 'xs' ? 'h-7 text-xs' : 'h-9 text-sm'
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
                @for (col of columns(); track col) {
                  <label class="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer text-sm transition-colors">
                    <tolle-checkbox [ngModel]="columnVisibility()[col.key]"
                      (ngModelChange)="toggleColumn(col.key)"/>
                    <span>{{ col.label }}</span>
                  </label>
                }
              </div>
            </tolle-popover-content>
          </tolle-popover>
        }
      </div>

      <div class="rounded-md border border-border overflow-auto shadow-sm bg-background">
        <table class="min-w-full text-sm">
          <thead class="border-b border-border bg-background">
            <tr>
              @if (expandable()) {
                <th [class]="cn('px-4', size() === 'xs' ? 'w-[32px]' : 'w-[48px]')"></th>
              }
              @for (col of activeColumns(); track col) {
                <th
                  [class]="cn('font-medium text-foreground text-left transition-all', headerPaddingClass(), fontSizeClass(), col.class)">
                  @if (col.sortable) {
                    <div (click)="toggleSort(col.key)" class="flex items-center gap-1 cursor-pointer hover:text-foreground group select-none">
                      {{ col.label }}
                      <i [class]="cn('transition-opacity', getSortIcon(col.key))"></i>
                    </div>
                  } @else {
                    {{ col.label }}
                  }
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            @for (row of pagedData(); track row; let i = $index) {
              <tr class="hover:bg-muted/50 transition-colors">
                @if (expandable()) {
                  <td class="px-4">
                    <button (click)="toggleRow(i)"
                      [class]="cn('flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors', size() === 'xs' ? 'h-6 w-6' : 'h-8 w-8')">
                      <i [class]="expandedRows().has(i) ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'"></i>
                    </button>
                  </td>
                }
                @for (col of activeColumns(); track col) {
                  <td [class]="cn('align-middle transition-all', cellPaddingClass(), fontSizeClass(), col.class)">
                    @if (getTemplate(col.key); as cell) {
                      <ng-container *ngTemplateOutlet="cell.template; context: { $implicit: row[col.key], row: row }"></ng-container>
                    } @else {
                      <span class="text-foreground">{{ row[col.key] }}</span>
                    }
                  </td>
                }
              </tr>
              @if (expandedRows().has(i)) {
                <tr class="bg-muted/10">
                  <td [attr.colspan]="activeColumns().length + (expandable() ? 1 : 0)" class="p-0">
                    <div class="p-6 border-b border-dashed border-border">
                      @if (expandedTemplate()) {
                        <ng-container *ngTemplateOutlet="expandedTemplate(); context: { row: row }"></ng-container>
                      } @else {
                        <div class="text-xs text-muted-foreground italic">No details available.</div>
                      }
                    </div>
                  </td>
                </tr>
              }
            }
            @if (pagedData().length === 0) {
              <tr class="h-24">
                <td [attr.colspan]="activeColumns().length + (expandable() ? 1 : 0)" class="text-center text-muted-foreground">No results found.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (paginate() && filteredData().length > 0) {
        <tolle-pagination
          [totalRecords]="filteredData().length"
          [pageSizeOptions]="pageSizeOptions()"
          [currentPage]="currentPage()"
          [currentPageSize]="pageSize()"
          (onPageNumberChange)="currentPage.set($event)"
          (onPageSizeChange)="pageSize.set($event)"
        ></tolle-pagination>
      }
    </div>
    `
})
export class DataTableComponent {
  data = input<any[]>([]);
  columns = input<TableColumn[]>([]);
  searchable = input(true);
  paginate = input(true);
  pageSizeOptions = input<number[]>([10, 20, 30, 50]);
  pageSize = model(10);
  expandable = input(false);
  size = input<'xs' | 'sm' | 'default' | 'lg'>('default');
  allowColumnHiding = input(true);
  showSettings = input(true);
  expandedTemplate = input<TemplateRef<any> | undefined>();

  cellTemplates = contentChildren(TolleCellDirective);

  searchTerm = signal('');
  currentPage = model(1);
  sortKey = signal('');
  sortDir = signal<'asc' | 'desc' | null>(null);
  expandedRows = signal<Set<number>>(new Set());

  // Track visibility state
  columnVisibility = signal<Record<string, boolean>>({});

  constructor() {
    effect(() => {
      const cols = this.columns();
      if (cols.length > 0) {
        untracked(() => {
          const currentVisibility = this.columnVisibility();
          const initialVisibility: Record<string, boolean> = { ...currentVisibility };
          let changed = false;

          cols.forEach((col: any) => {
            if (initialVisibility[col.key] === undefined) {
              initialVisibility[col.key] = true;
              changed = true;
            }
          });

          if (changed) {
            this.columnVisibility.set(initialVisibility);
          }
        });
      }
    }, { allowSignalWrites: true });
  }

  activeColumns = computed(() => {
    const visibility = this.columnVisibility();
    return this.columns().filter((col: any) => visibility[col.key]);
  });

  filteredData = computed(() => {
    let result = [...this.data()];
    const q = this.searchTerm().toLowerCase();

    if (q) {
      result = result.filter(row =>
        Object.values(row).some(val => String(val).toLowerCase().includes(q))
      );
    }

    const key = this.sortKey();
    const dir = this.sortDir();
    if (key && dir) {
      result.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (valA < valB) return dir === 'asc' ? -1 : 1;
        if (valA > valB) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  pagedData = computed(() => {
    const data = this.filteredData();
    if (!this.paginate()) return data;

    const size = Number(this.pageSize());
    const current = Number(this.currentPage());

    if (isNaN(size) || size <= 0) return [];

    const start = (current - 1) * size;
    const end = start + size;

    return data.slice(start, end);
  });

  // Style Getters
  cellPaddingClass = computed(() => {
    switch (this.size()) {
      case 'xs': return 'p-1 px-4';
      case 'sm': return 'p-2 px-4';
      case 'lg': return 'p-6 px-4';
      default: return 'p-4';
    }
  });

  headerPaddingClass = computed(() => {
    switch (this.size()) {
      case 'xs': return 'h-7 px-4';
      case 'sm': return 'h-9 px-4';
      case 'lg': return 'h-14 px-4';
      default: return 'h-12 px-4';
    }
  });

  fontSizeClass = computed(() => {
    switch (this.size()) {
      case 'xs': return 'text-[11px]';
      case 'sm': return 'text-xs';
      case 'lg': return 'text-base';
      default: return 'text-sm';
    }
  });

  protected cn = cn;

  toggleColumn(key: string) {
    this.columnVisibility.update((prev: Record<string, boolean>) => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  toggleSort(key: string) {
    if (this.sortKey() === key) {
      this.sortDir.update((dir: 'asc' | 'desc' | null) => dir === 'asc' ? 'desc' : dir === 'desc' ? null : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
  }

  getSortIcon(key: string) {
    if (this.sortKey() !== key || !this.sortDir()) return 'ri-expand-up-down-line opacity-20';
    return this.sortDir() === 'asc' ? 'ri-arrow-up-line text-foreground' : 'ri-arrow-down-line text-foreground';
  }

  toggleRow(index: number) {
    this.expandedRows.update((prev: Set<number>) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  getTemplate(key: string): TolleCellDirective | undefined {
    return this.cellTemplates().find((t: TolleCellDirective) => t.name() === key);
  }
}
