import { Component, inject, OnInit } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseService } from '../../../shared/base.service';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { FormsModule } from '@angular/forms';
import { BaseTableComponent } from '../../../docs-examples/data-table/base-table/base-table.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-data-table-basic',
    imports: [
        BaseEditorComponent,
        NgIf,
        AsyncPipe,
        SegmentedComponent,
        FormsModule,
        BaseTableComponent
    ],
    templateUrl: './data-table-basic.component.html'
})
export class DataTableBasicComponent implements OnInit {
    baseService = inject(BaseService);
    sourceService = inject(SourceCodeService);

    htmlCode$!: Observable<string>;
    tsCode$!: Observable<string>;

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

    ngOnInit(): void {
        this.htmlCode$ = this.sourceService.getFile('data-table/base-table/base-table.component.html');
        this.tsCode$ = this.sourceService.getFile('data-table/base-table/base-table.component.ts');
    }
}
