import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { BaseTableComponent } from '../../../docs-examples/data-table/base-table/base-table.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-data-table-basic',
    standalone: true,
    imports: [
        AsyncPipe,
        ComponentPreviewComponent,
        BaseTableComponent
    ],
    templateUrl: './data-table-basic.component.html'
})
export class DataTableBasicComponent implements OnInit {
    sourceService = inject(SourceCodeService);

    htmlCode$!: Observable<string>;
    tsCode$!: Observable<string>;

    ngOnInit(): void {
        this.htmlCode$ = this.sourceService.getFile('data-table/base-table/base-table.component.html');
        this.tsCode$ = this.sourceService.getFile('data-table/base-table/base-table.component.ts');
    }
}
