import {Component, inject, OnInit} from '@angular/core';
import {BaseEditorComponent} from "../../shared/base-editor/base-editor.component";
import {SegmentedComponent} from "../../../../../tolle/src/lib/segment.component";
import {BaseService} from '../../shared/base.service';
import {AnalyticsService} from '../../analytics.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  DataTableStandardComponent
} from '../../docs-examples/data-table/data-table-standard/data-table-standard.component';
import {Observable} from 'rxjs';
import {SourceCodeService} from '../../shared/source-code.service';
import {BaseTableComponent} from '../../docs-examples/data-table/base-table/base-table.component';
import {ColumnHidingDocsComponent} from './column-hiding-docs/column-hiding-docs.component';
import {PaginationDocsComponent} from './pagination-docs/pagination-docs.component';
import {SearchableDocsComponent} from './searchable-docs/searchable-docs.component';

@Component({
  selector: 'app-data-table-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    SegmentedComponent,
    NgIf,
    FormsModule,
    DataTableStandardComponent,
    AsyncPipe,
    BaseTableComponent,
    ColumnHidingDocsComponent,
    PaginationDocsComponent,
    SearchableDocsComponent,
  ],
  templateUrl: './data-table-docs.component.html',
  styleUrl: './data-table-docs.component.css'
})
export class DataTableDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);
  sourceService = inject(SourceCodeService);

  standardHtmlCode$!: Observable<string>;
  standardJsCode$!: Observable<string>;
  prerequisiteCode$!: Observable<string>;
  columDefCode$!: Observable<string>;

  basicHtmlCode$!: Observable<string>;
  basicJsCode$!: Observable<string>;

  ngOnInit(): void {
    this.analytics.init();
    this.standardHtmlCode$ = this.sourceService.getFile('data-table/data-table-standard/data-table-standard.component.html');
    this.standardJsCode$ = this.sourceService.getFile('data-table/data-table-standard/data-table-standard.component.ts');
    this.basicHtmlCode$ = this.sourceService.getFile('data-table/base-table/base-table.component.html');
    this.basicJsCode$ = this.sourceService.getFile('data-table/base-table/base-table.component.ts');
    this.prerequisiteCode$ = this.sourceService.getFile('data-table/prerequisite.ts');
    this.columDefCode$ = this.sourceService.getFile('data-table/column-def.ts');

  }
  selectedTab = "preview";

  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  basicTab = "preview";

  basicViewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  standardCode = "html";
  standardCodeViewOptions = [
    { label: 'Html', value: 'html' },
    { label: 'Typescript', value: 'typescript' }
  ];

  basicCode = "html";
  basicCodeViewOptions = [
    { label: 'Html', value: 'html' },
    { label: 'Typescript', value: 'typescript' }
  ];


}
