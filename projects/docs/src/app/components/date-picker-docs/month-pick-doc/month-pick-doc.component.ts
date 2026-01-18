import {Component, inject, OnInit} from '@angular/core';
import {BaseService} from '../../../shared/base.service';
import {SourceCodeService} from '../../../shared/source-code.service';
import {Observable} from 'rxjs';
import {AsyncPipe, NgIf} from '@angular/common';
import {BaseDatePickerComponent} from '../../../docs-examples/date-picker/base-date-picker/base-date-picker.component';
import {BaseEditorComponent} from '../../../shared/base-editor/base-editor.component';
import {SegmentedComponent} from '../../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {MonthPickerComponent} from '../../../docs-examples/date-picker/month-picker/month-picker.component';

@Component({
  selector: 'app-month-pick-doc',
  standalone: true,
  imports: [
    AsyncPipe,
    BaseEditorComponent,
    NgIf,
    SegmentedComponent,
    FormsModule,
    MonthPickerComponent
  ],
  templateUrl: './month-pick-doc.component.html',
  styleUrl: './month-pick-doc.component.css'
})
export class MonthPickDocComponent implements OnInit {
  baseService = inject(BaseService);
  sourceService = inject(SourceCodeService);
  htmlCode$!: Observable<string>;
  jsCode$!: Observable<string>;

  codeTab = "html";
  codeViewOptions = [
    { label: 'Html', value: 'html' },
    { label: 'Typescript', value: 'typescript' }
  ];

  ngOnInit(): void {
    this.htmlCode$ = this.sourceService.getFile('date-picker/month-picker/month-picker.component.html');
    this.jsCode$ = this.sourceService.getFile('date-picker/month-picker/month-picker.component.ts');
  }
}
