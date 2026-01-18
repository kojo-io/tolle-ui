import {Component, inject, OnInit} from '@angular/core';
import {BaseService} from '../../../shared/base.service';
import {SourceCodeService} from '../../../shared/source-code.service';
import {Observable} from 'rxjs';
import {AsyncPipe, NgIf} from '@angular/common';
import {BaseDatePickerComponent} from '../../../docs-examples/date-picker/base-date-picker/base-date-picker.component';
import {BaseEditorComponent} from '../../../shared/base-editor/base-editor.component';
import {SegmentedComponent} from '../../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-date-pick-doc',
  standalone: true,
  imports: [
    AsyncPipe,
    BaseDatePickerComponent,
    BaseEditorComponent,
    NgIf,
    SegmentedComponent,
    FormsModule
  ],
  templateUrl: './date-pick-doc.component.html',
  styleUrl: './date-pick-doc.component.css'
})
export class DatePickDocComponent implements OnInit {
  baseService = inject(BaseService);
  sourceService = inject(SourceCodeService);
  htmlCode$!: Observable<string>;
  jsCode$!: Observable<string>;

  viewTab = "preview";
  ViewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  codeTab = "html";
  codeViewOptions = [
    { label: 'Html', value: 'html' },
    { label: 'Typescript', value: 'typescript' }
  ];

  ngOnInit(): void {
    this.htmlCode$ = this.sourceService.getFile('date-picker/base-date-picker/base-date-picker.component.html');
    this.jsCode$ = this.sourceService.getFile('date-picker/base-date-picker/base-date-picker.component.ts');
  }

}

