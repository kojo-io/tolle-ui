import {Component, inject, OnInit} from '@angular/core';
import {SourceCodeService} from '../../../shared/source-code.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {ComponentPreviewComponent} from '../../../shared/component-preview/component-preview.component';
import {SearchableComponent} from '../../../docs-examples/data-table/searchable/searchable.component';

@Component({
  selector: 'app-searchable-docs',
  standalone: true,
  imports: [
    AsyncPipe,
    ComponentPreviewComponent,
    SearchableComponent
  ],
  templateUrl: './searchable-docs.component.html',
  styleUrl: './searchable-docs.component.css'
})
export class SearchableDocsComponent implements OnInit {
  sourceService = inject(SourceCodeService);
  hidingHtmlCode$!: Observable<string>;
  hidingJsCode$!: Observable<string>;

  ngOnInit(): void {
    this.hidingHtmlCode$ = this.sourceService.getFile('data-table/searchable/searchable.component.html');
    this.hidingJsCode$ = this.sourceService.getFile('data-table/searchable/searchable.component.ts');
  }

}
