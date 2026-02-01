import { Component, inject, OnInit } from '@angular/core';
import { BaseService } from '../../../shared/base.service';
import { SourceCodeService } from '../../../shared/source-code.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { FormsModule } from '@angular/forms';
import { StickyComponent } from '../../../docs-examples/data-table/sticky/sticky.component';

@Component({
    selector: 'app-sticky-docs',
    standalone: true,
    imports: [
        AsyncPipe,
        BaseEditorComponent,
        NgIf,
        SegmentedComponent,
        FormsModule,
        StickyComponent
    ],
    templateUrl: './sticky-docs.component.html'
})
export class StickyDocsComponent implements OnInit {
    baseService = inject(BaseService);
    sourceService = inject(SourceCodeService);

    htmlCode$!: Observable<string>;
    tsCode$!: Observable<string>;

    activeCallback = 'preview';
    viewOptions = [
        { label: 'Preview', value: 'preview' },
        { label: 'Code', value: 'code' }
    ];

    codeType = 'html';
    codeOptions = [
        { label: 'HTML', value: 'html' },
        { label: 'TypeScript', value: 'typescript' }
    ];

    ngOnInit(): void {
        this.htmlCode$ = this.sourceService.getFile('data-table/sticky/sticky.component.html');
        this.tsCode$ = this.sourceService.getFile('data-table/sticky/sticky.component.ts');
    }
}
