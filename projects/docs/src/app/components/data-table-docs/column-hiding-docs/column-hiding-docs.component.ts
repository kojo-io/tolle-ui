import {Component, inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {SourceCodeService} from '../../../shared/source-code.service';
import {AsyncPipe} from '@angular/common';
import {ComponentPreviewComponent} from '../../../shared/component-preview/component-preview.component';
import {ColumnHidingComponent} from '../../../docs-examples/data-table/column-hiding/column-hiding.component';

@Component({
  selector: 'app-column-hiding-docs',
  standalone: true,
  imports: [
    AsyncPipe,
    ComponentPreviewComponent,
    ColumnHidingComponent
  ],
  templateUrl: './column-hiding-docs.component.html',
  styleUrl: './column-hiding-docs.component.css'
})
export class ColumnHidingDocsComponent implements OnInit {
  sourceService = inject(SourceCodeService);
  hidingHtmlCode$!: Observable<string>;
  hidingJsCode$!: Observable<string>;

  ngOnInit(): void {
    this.hidingHtmlCode$ = this.sourceService.getFile('data-table/column-hiding/column-hiding.component.html');
    this.hidingJsCode$ = this.sourceService.getFile('data-table/column-hiding/column-hiding.component.ts');
  }
}
