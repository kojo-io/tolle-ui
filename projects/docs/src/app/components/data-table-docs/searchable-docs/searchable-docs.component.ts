import {Component, inject, OnInit} from '@angular/core';
import {BaseService} from '../../../shared/base.service';
import {SourceCodeService} from '../../../shared/source-code.service';
import {Observable} from 'rxjs';
import {AsyncPipe, NgIf} from '@angular/common';
import {BaseEditorComponent} from '../../../shared/base-editor/base-editor.component';
import {
  PaginationExampleComponent
} from '../../../docs-examples/data-table/pagination-example/pagination-example.component';
import {SegmentedComponent} from '../../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {SearchableComponent} from '../../../docs-examples/data-table/searchable/searchable.component';

@Component({
  selector: 'app-searchable-docs',
  standalone: true,
  imports: [
    AsyncPipe,
    BaseEditorComponent,
    NgIf,
    PaginationExampleComponent,
    SegmentedComponent,
    FormsModule,
    SearchableComponent
  ],
  templateUrl: './searchable-docs.component.html',
  styleUrl: './searchable-docs.component.css'
})
export class SearchableDocsComponent implements OnInit {
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
    this.hidingHtmlCode$ = this.sourceService.getFile('data-table/searchable/searchable.component.html');
    this.hidingJsCode$ = this.sourceService.getFile('data-table/searchable/searchable.component.ts');
  }

}
