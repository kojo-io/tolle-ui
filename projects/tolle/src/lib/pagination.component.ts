import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { cn } from './utils/cn';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from './select.component';
import { SelectItemComponent } from './select-item.component';

@Component({
  selector: 'tolle-pagination',
  styles: [':host { display: block; }'],
  imports: [FormsModule, SelectComponent, SelectItemComponent],
  template: `
    <nav role="navigation" aria-label="pagination">
      <div [class]="cn('flex items-center justify-between px-2 py-1', class)">
        @if (showCurrentPageInfo) {
          <div class="text-sm text-muted-foreground">
            @if (currentPageInfoTemplate) {
              {{ pageReport }}
            } @else {
              Showing {{ first }} to {{ last }} of {{ totalRecords }} entries
            }
          </div>
        }

        <div class="flex items-center space-x-6 lg:space-x-8">
          @if (showPageOptions) {
            <div class="flex items-center space-x-2">
              <p class="text-sm font-medium">Rows per page</p>
              <tolle-select
                class="w-[70px]"
                size="sm"
                [ngModel]="currentPageSize"
                (ngModelChange)="sizeChange($event)">
                @for (opt of pageSizeOptions; track opt) {
                  <tolle-select-item [value]="opt">
                    {{ opt }}
                  </tolle-select-item>
                }
              </tolle-select>
            </div>
          }

          <div class="flex items-center space-x-2">
            @if (!showPageLinks) {
              <div class="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {{ currentPage }} of {{ totalPages }}
              </div>
            }

            @if (showPageLinks) {
              <div class="flex items-center space-x-1">
                <button
                  (click)="previousPage()"
                  [disabled]="currentPage === 1"
                  aria-label="Go to previous page"
                  [class]="navBtnClass">
                  <i aria-hidden="true" class="ri-arrow-left-s-line"></i>
                </button>
                @for (page of displayPageIndex; track page) {
                  <button
                    (click)="selectPage(page)"
                    [attr.aria-current]="currentPage === page ? 'page' : null"
                    [class]="
                      cn(
                        'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        currentPage === page
                          ? 'bg-primary font-medium text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      )
                    ">
                    {{ page }}
                  </button>
                }
                <button
                  (click)="nextPage()"
                  [disabled]="currentPage === totalPages || totalPages === 0"
                  aria-label="Go to next page"
                  [class]="navBtnClass">
                  <i aria-hidden="true" class="ri-arrow-right-s-line"></i>
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() class = '';
  @Input() showPageLinks = true;
  @Input() showPageOptions = true;
  @Input() showCurrentPageInfo = true;
  @Input() currentPageInfoTemplate?: string;

  @Input() totalRecords = 0;
  @Input() currentPageSize = 10;
  @Input() currentPage = 1;
  @Input() pageSizeOptions: number[] = [10, 20, 30, 50];

  @Output() onPageNumberChange = new EventEmitter<number>();
  @Output() onPageSizeChange = new EventEmitter<number>();

  totalPages = 0;
  first = 0;
  last = 0;
  displayPageIndex: number[] = [];
  pageReport = '';

  private initialized = false;
  private cd = inject(ChangeDetectorRef);
  protected cn = cn;

  navBtnClass =
    'h-8 w-8 p-0 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer';

  ngOnInit(): void {
    if (this.pageSizeOptions.length === 0) {
      this.pageSizeOptions = [10, 20, 30, 50];
    }
    this.initializePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only re-init if meaningful data changes
    if (changes['totalRecords'] || changes['currentPage'] || changes['currentPageSize']) {
      this.initializePagination();
    }

    // A bound `class` input is written through Angular's styling path,
    // which does not mark an OnPush view dirty on its own.
    this.cd.markForCheck();
  }

  private initializePagination(): void {
    this.calcPagination();
    if (!this.initialized) {
      this.initialized = true;
    }
    this.cd.detectChanges();
  }

  nextPage() {
    if (this.totalPages > this.currentPage) {
      this.currentPage++;
      this.emitChange();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.emitChange();
    }
  }

  selectPage(page: number) {
    if (this.currentPage === page) return;
    this.currentPage = page;
    this.emitChange();
  }

  sizeChange(size: number) {
    this.currentPageSize = size;
    this.currentPage = 1; // Reset to page 1 on size change
    this.emitChange();
  }

  private emitChange(): void {
    this.calcPagination();
    this.onPageNumberChange.emit(this.currentPage);
    this.onPageSizeChange.emit(this.currentPageSize);
    this.cd.detectChanges();
  }

  private calcPagination(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.currentPageSize) || 0;

    // Bounds check
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    this.first = this.totalRecords === 0 ? 0 : (this.currentPage - 1) * this.currentPageSize + 1;
    this.last = Math.min(this.totalRecords, this.currentPage * this.currentPageSize);

    // Calculate Sliding Window for Page Numbers (Max 5 visible)
    const pages: number[] = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    if (this.totalPages <= 5) {
      this.displayPageIndex = pages;
    } else {
      let start = Math.max(0, this.currentPage - 3);
      let end = start + 5;

      if (end > this.totalPages) {
        end = this.totalPages;
        start = end - 5;
      }
      this.displayPageIndex = pages.slice(start, end);
    }

    // Template Parsing
    if (this.currentPageInfoTemplate) {
      this.pageReport = this.currentPageInfoTemplate.replace(
        /{first}|{last}|{totalRecords}|{currentPage}|{currentPageSize}|{totalPages}/g,
        match => {
          switch (match) {
            case '{first}':
              return `${this.first}`;
            case '{last}':
              return `${this.last}`;
            case '{totalRecords}':
              return `${this.totalRecords}`;
            case '{totalPages}':
              return `${this.totalPages}`;
            case '{currentPage}':
              return `${this.currentPage}`;
            case '{currentPageSize}':
              return `${this.currentPageSize}`;
            default:
              return match;
          }
        }
      );
    }
  }
}
