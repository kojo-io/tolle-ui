import {Component, inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {SourceCodeService} from '../../../shared/source-code.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {BaseEditorComponent} from '../../../shared/base-editor/base-editor.component';
import {SegmentedComponent} from '../../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {ColumnHidingComponent} from '../../../docs-examples/data-table/column-hiding/column-hiding.component';
import {BaseService} from '../../../shared/base.service';

@Component({
  selector: 'app-column-hiding-docs',
  standalone: true,
  imports: [
    AsyncPipe,
    BaseEditorComponent,
    NgIf,
    SegmentedComponent,
    FormsModule,
    ColumnHidingComponent
  ],
  templateUrl: './column-hiding-docs.component.html',
  styleUrl: './column-hiding-docs.component.css'
})
export class ColumnHidingDocsComponent implements OnInit {
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
    this.hidingHtmlCode$ = this.sourceService.getFile('data-table/column-hiding/column-hiding.component.html');
    this.hidingJsCode$ = this.sourceService.getFile('data-table/column-hiding/column-hiding.component.ts');

  }
}
