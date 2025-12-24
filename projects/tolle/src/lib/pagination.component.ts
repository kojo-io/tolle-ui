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
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';
import {FormsModule} from '@angular/forms';
import {SelectComponent} from './select.component';
import {SelectItemComponent} from './select-item.component';

@Component({
  selector: 'tolle-pagination',
  standalone: true,
  imports: [CommonModule, SelectComponent, SelectItemComponent, FormsModule],
  template: `
    <div [class]="cn('flex items-center justify-between px-2 py-4', class)">

      <div *ngIf="showCurrentPageInfo" class="text-sm text-muted-foreground">
        <ng-container *ngIf="currentPageInfoTemplate; else defaultReport">
          {{ pageReport }}
        </ng-container>
        <ng-template #defaultReport>
          Showing {{ first }} to {{ last }} of {{ totalRecords }} entries
        </ng-template>
      </div>

      <div class="flex items-center space-x-6 lg:space-x-8">

        <div *ngIf="showPageOptions" class="flex items-center space-x-2">
          <p class="text-sm font-medium">Rows per page</p>
          <tolle-select
            class="w-[70px]"
            size="sm"
            [ngModel]="currentPageSize"
            (ngModelChange)="sizeChange($event)"
          >
            <tolle-select-item *ngFor="let opt of pageSizeOptions" [value]="opt">
              {{ opt }}
            </tolle-select-item>
          </tolle-select>
        </div>

        <div class="flex items-center space-x-2">
          <div *ngIf="!showPageLinks" class="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {{ currentPage }} of {{ totalPages }}
          </div>

          <div *ngIf="showPageLinks" class="flex items-center space-x-1">
            <button
              (click)="previousPage()"
              [disabled]="currentPage === 1"
              [class]="navBtnClass"
            >
              <i class="ri-arrow-left-s-line"></i>
            </button>

            <button
              *ngFor="let page of displayPageIndex"
              (click)="selectPage(page)"
              [class]="cn(
                'h-8 w-8 text-sm rounded-md flex items-center justify-center transition-colors',
                currentPage === page
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )"
            >
              {{ page }}
            </button>

            <button
              (click)="nextPage()"
              [disabled]="currentPage === totalPages || totalPages === 0"
              [class]="navBtnClass"
            >
              <i class="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
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

  navBtnClass = 'h-8 w-8 p-0 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed';

  ngOnInit(): void {
    this.initializePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only re-init if meaningful data changes
    if (changes['totalRecords'] || changes['currentPage'] || changes['currentPageSize']) {
      this.initializePagination();
    }
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
        (match) => {
          switch (match) {
            case '{first}': return `${this.first}`;
            case '{last}': return `${this.last}`;
            case '{totalRecords}': return `${this.totalRecords}`;
            case '{totalPages}': return `${this.totalPages}`;
            case '{currentPage}': return `${this.currentPage}`;
            case '{currentPageSize}': return `${this.currentPageSize}`;
            default: return match;
          }
        }
      );
    }
  }
}
