import {Component, inject, OnInit} from '@angular/core';
import {BaseService} from '../../../shared/base.service';
import {SourceCodeService} from '../../../shared/source-code.service';
import {Observable} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {BaseEditorComponent} from '../../../shared/base-editor/base-editor.component';
import {SegmentedComponent} from '../../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {
  PaginationExampleComponent
} from '../../../docs-examples/data-table/pagination-example/pagination-example.component';

@Component({
    selector: 'app-pagination-docs',
    imports: [
    AsyncPipe,
    BaseEditorComponent,
    SegmentedComponent,
    FormsModule,
    PaginationExampleComponent
],
    templateUrl: './pagination-docs.component.html',
    styleUrl: './pagination-docs.component.css'
})
export class PaginationDocsComponent implements OnInit {
  baseService = inject(BaseService);
  sourceService = inject(SourceCodeService);
  hidingHtmlCode$!: Observable<string>;
  hidingJsCode$!: Observable<string>;

  columnTab = "preview";
  columnViewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  columnCode = "html";
  columnCodeViewOptions = [
    { label: 'Html', value: 'html' },
    { label: 'Typescript', value: 'typescript' }
  ];

  ngOnInit(): void {
    this.hidingHtmlCode$ = this.sourceService.getFile('data-table/pagination-example/pagination-example.component.html');
    this.hidingJsCode$ = this.sourceService.getFile('data-table/pagination-example/pagination-example.component.ts');
  }

}
