import { Component, inject, OnInit } from '@angular/core';
import { SourceCodeService } from '../../../shared/source-code.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { BaseDatePickerComponent } from '../../../docs-examples/date-picker/base-date-picker/base-date-picker.component';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';

@Component({
  selector: 'app-date-pick-doc',
  standalone: true,
  imports: [
    AsyncPipe,
    BaseDatePickerComponent,
    ComponentPreviewComponent
  ],
  templateUrl: './date-pick-doc.component.html',
  styleUrl: './date-pick-doc.component.css'
})
export class DatePickDocComponent implements OnInit {
  sourceService = inject(SourceCodeService);
  htmlCode$!: Observable<string>;
  jsCode$!: Observable<string>;

  ngOnInit(): void {
    this.htmlCode$ = this.sourceService.getFile('date-picker/base-date-picker/base-date-picker.component.html');
    this.jsCode$ = this.sourceService.getFile('date-picker/base-date-picker/base-date-picker.component.ts');
  }
}
