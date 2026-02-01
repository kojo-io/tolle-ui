import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { cn } from './utils/cn';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from './select.component';
import { SelectItemComponent } from './select-item.component';

@Component({
  selector: 'tolle-pagination',
  standalone: true,
  imports: [FormsModule, SelectComponent, SelectItemComponent],
  template: `
    <div [class]="cn('flex items-center justify-between px-2 py-4', class())">
    
      @if (showCurrentPageInfo()) {
        <div class="text-sm text-muted-foreground">
          @if (currentPageInfoTemplate()) {
            {{ pageReport() }}
          } @else {
            Showing {{ first() }} to {{ last() }} of {{ totalRecords() }} entries
          }
        </div>
      }
    
      <div class="flex items-center space-x-6 lg:space-x-8">
    
        @if (showPageOptions()) {
          <div class="flex items-center space-x-2">
            <p class="text-sm font-medium">Rows per page</p>
            <tolle-select
              class="w-[80px]"
              size="sm"
              [ngModel]="currentPageSize()"
              (ngModelChange)="sizeChange($event)"
              >
              @for (opt of pageSizeOptions(); track opt) {
                <tolle-select-item [value]="opt">
                  {{ opt }}
                </tolle-select-item>
              }
            </tolle-select>
          </div>
        }
    
        <div class="flex items-center space-x-2">
          @if (!showPageLinks()) {
            <div class="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {{ currentPage() }} of {{ totalPages() }}
            </div>
          }
    
          @if (showPageLinks()) {
            <div class="flex items-center space-x-1">
              <button
                (click)="previousPage()"
                [disabled]="currentPage() === 1"
                [class]="navBtnClass"
                >
                <i class="ri-arrow-left-s-line"></i>
              </button>
              @for (page of displayPageIndex(); track page) {
                <button
                  (click)="selectPage(page)"
              [class]="cn(
                'h-8 w-8 text-sm rounded-md flex items-center justify-center transition-colors',
                currentPage() === page
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )"
                  >
                  {{ page }}
                </button>
              }
              <button
                (click)="nextPage()"
                [disabled]="currentPage() === totalPages() || totalPages() === 0"
                [class]="navBtnClass"
                >
                <i class="ri-arrow-right-s-line"></i>
              </button>
            </div>
          }
        </div>
      </div>
    </div>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  class = input('');
  showPageLinks = input(true);
  showPageOptions = input(true);
  showCurrentPageInfo = input(true);
  currentPageInfoTemplate = input<string | undefined>();

  totalRecords = input(0);
  currentPageSize = input(10);
  currentPage = input(1);
  pageSizeOptions = input<number[]>([10, 20, 30, 50]);

  onPageNumberChange = output<number>();
  onPageSizeChange = output<number>();

  protected cn = cn;
  navBtnClass = 'h-8 w-8 p-0 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed';

  totalPages = computed(() => {
    const size = this.currentPageSize();
    const total = this.totalRecords();
    if (!size || size <= 0) return 0;
    return Math.ceil(total / size) || 0;
  });

  first = computed(() => this.totalRecords() === 0 ? 0 : (this.currentPage() - 1) * this.currentPageSize() + 1);
  last = computed(() => Math.min(this.totalRecords(), this.currentPage() * this.currentPageSize()));

  displayPageIndex = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = Array.from({ length: total }, (_, i) => i + 1);

    if (total <= 5) {
      return pages;
    } else {
      let start = Math.max(0, current - 3);
      let end = start + 5;

      if (end > total) {
        end = total;
        start = end - 5;
      }
      return pages.slice(start, end);
    }
  });

  pageReport = computed(() => {
    const template = this.currentPageInfoTemplate();
    if (!template) return '';

    return template.replace(
      /{first}|{last}|{totalRecords}|{currentPage}|{currentPageSize}|{totalPages}/g,
      (match) => {
        switch (match) {
          case '{first}': return `${this.first()}`;
          case '{last}': return `${this.last()}`;
          case '{totalRecords}': return `${this.totalRecords()}`;
          case '{totalPages}': return `${this.totalPages()}`;
          case '{currentPage}': return `${this.currentPage()}`;
          case '{currentPageSize}': return `${this.currentPageSize()}`;
          default: return match;
        }
      }
    );
  });

  nextPage() {
    if (this.totalPages() > this.currentPage()) {
      this.onPageNumberChange.emit(this.currentPage() + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.onPageNumberChange.emit(this.currentPage() - 1);
    }
  }

  selectPage(page: number) {
    if (this.currentPage() === page) return;
    this.onPageNumberChange.emit(page);
  }

  sizeChange(size: number) {
    this.onPageSizeChange.emit(size);
    this.onPageNumberChange.emit(1); // Reset to page 1 on size change
  }
}
