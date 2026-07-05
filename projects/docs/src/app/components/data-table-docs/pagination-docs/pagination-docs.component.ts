import {Component, inject, OnInit} from '@angular/core';
import {SourceCodeService} from '../../../shared/source-code.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {ComponentPreviewComponent} from '../../../shared/component-preview/component-preview.component';
import {
  PaginationExampleComponent
} from '../../../docs-examples/data-table/pagination-example/pagination-example.component';

@Component({
  selector: 'app-pagination-docs',
  standalone: true,
  imports: [
    AsyncPipe,
    ComponentPreviewComponent,
    PaginationExampleComponent
  ],
  templateUrl: './pagination-docs.component.html',
  styleUrl: './pagination-docs.component.css'
})
export class PaginationDocsComponent implements OnInit {
  sourceService = inject(SourceCodeService);
  hidingHtmlCode$!: Observable<string>;
  hidingJsCode$!: Observable<string>;

  ngOnInit(): void {
    this.hidingHtmlCode$ = this.sourceService.getFile('data-table/pagination-example/pagination-example.component.html');
    this.hidingJsCode$ = this.sourceService.getFile('data-table/pagination-example/pagination-example.component.ts');
  }

}
