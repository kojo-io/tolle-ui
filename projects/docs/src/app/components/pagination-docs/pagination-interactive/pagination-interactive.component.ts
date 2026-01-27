import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../../../../tolle/src/lib/pagination.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-pagination-interactive',
    imports: [
        CommonModule,
        FormsModule,
        PaginationComponent,
        InputComponent,
        CheckboxComponent,
        PlaygroundComponent
    ],
    templateUrl: './pagination-interactive.component.html'
})
export class PaginationInteractiveComponent {
    totalRecords = 100;
    currentPage = 1;
    currentPageSize = 10;
    showPageLinks = true;
    showPageOptions = true;
    showCurrentPageInfo = true;

    get playgroundCode(): string {
        const inputs = [
            this.totalRecords !== 100 ? `[totalRecords]="${this.totalRecords}"` : '',
            this.currentPage !== 1 ? `[(currentPage)]="${this.currentPage}"` : '',
            this.currentPageSize !== 10 ? `[currentPageSize]="${this.currentPageSize}"` : '',
            !this.showPageLinks ? '[showPageLinks]="false"' : '',
            !this.showPageOptions ? '[showPageOptions]="false"' : '',
            !this.showCurrentPageInfo ? '[showCurrentPageInfo]="false"' : ''
        ].filter(Boolean).join('\n  ');

        return `<tolle-pagination${inputs ? '\n  ' + inputs : ''}
></tolle-pagination>`;
    }

    onPageChange(page: number) {
        this.currentPage = page;
    }

    onSizeChange(size: number) {
        this.currentPageSize = size;
    }
}
