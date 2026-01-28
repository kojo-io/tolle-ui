import { Component, inject, OnInit } from '@angular/core';
import { BaseService } from '../../../shared/base.service';
import { SourceCodeService } from '../../../shared/source-code.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { MonthPickerComponent } from '../../../docs-examples/date-picker/month-picker/month-picker.component';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { FormsModule } from '@angular/forms';
import { YearPickerComponent } from '../../../docs-examples/date-picker/year-picker/year-picker.component';

@Component({
    selector: 'app-year-pick-doc',
    imports: [
    AsyncPipe,
    BaseEditorComponent,
    SegmentedComponent,
    FormsModule,
    YearPickerComponent
],
    templateUrl: './year-pick-doc.component.html',
    styleUrl: './year-pick-doc.component.css'
})
export class YearPickDocComponent implements OnInit {
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
    this.htmlCode$ = this.sourceService.getFile('date-picker/year-picker/year-picker.component.html');
    this.jsCode$ = this.sourceService.getFile('date-picker/year-picker/year-picker.component.ts');
  }
}
