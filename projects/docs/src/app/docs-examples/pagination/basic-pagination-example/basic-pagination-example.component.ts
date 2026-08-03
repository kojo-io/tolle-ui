import { Component } from '@angular/core';

import { PaginationComponent } from '../../../../../../tolle/src/lib/pagination.component';

@Component({
  selector: 'app-basic-pagination-example',
  imports: [PaginationComponent],
  template: `
    <div class="flex w-full flex-col gap-4">
      <tolle-pagination
        [totalRecords]="100"
        [currentPage]="page"
        [currentPageSize]="10"
        (onPageNumberChange)="onPageChange($event)"></tolle-pagination>

      <div class="mt-4 text-center text-sm text-muted-foreground">
        Current Page: <span class="font-mono text-foreground">{{ page }}</span>
      </div>
    </div>
  `,
})
export class BasicPaginationExampleComponent {
  page = 1;

  onPageChange(event: number) {
    this.page = event;
  }
}
