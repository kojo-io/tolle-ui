import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { SourceCodeService } from '../../../shared/source-code.service';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { DataTableStickyComponent } from '../../../docs-examples/data-table/data-table-sticky/data-table-sticky.component';

@Component({
    selector: 'app-data-table-sticky-docs',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SegmentedComponent,
        ComponentPreviewComponent,
        DataTableStickyComponent
    ],
    templateUrl: './data-table-sticky.component.html'
})
export class DataTableStickyDocsComponent implements OnInit {
    sourceService = inject(SourceCodeService);

    htmlCode!: Observable<string>;
    tsCode!: Observable<string>;

    selectedHeight = '400px';
    heightOptions = [
        { label: '400px', value: '400px' },
        { label: '80%', value: '80%' },
        { label: '100%', value: '100%' }
    ];

    ngOnInit(): void {
        this.htmlCode = this.sourceService.getFile('data-table/data-table-sticky/data-table-sticky.component.html');
        this.tsCode = this.sourceService.getFile('data-table/data-table-sticky/data-table-sticky.component.ts');
    }
}
