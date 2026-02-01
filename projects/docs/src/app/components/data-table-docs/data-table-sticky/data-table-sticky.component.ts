import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/base.service';
import { SourceCodeService } from '../../../shared/source-code.service';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DataTableStickyComponent } from '../../../docs-examples/data-table/data-table-sticky/data-table-sticky.component';

@Component({
    selector: 'app-data-table-sticky-docs',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SegmentedComponent,
        BaseEditorComponent,
        DataTableStickyComponent
    ],
    templateUrl: './data-table-sticky.component.html'
})
export class DataTableStickyDocsComponent implements OnInit {
    baseService = inject(BaseService);
    sourceService = inject(SourceCodeService);

    htmlCode!: Observable<string>;
    tsCode!: Observable<string>;

    tab = 'preview';
    viewOptions = [
        { label: 'Preview', value: 'preview' },
        { label: 'Code', value: 'code' }
    ];

    codeTab = 'html';
    codeViewOptions = [
        { label: 'HTML', value: 'html' },
        { label: 'Typescript', value: 'typescript' }
    ];

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
