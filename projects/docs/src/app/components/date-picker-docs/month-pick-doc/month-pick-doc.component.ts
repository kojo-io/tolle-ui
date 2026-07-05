import {Component, inject, OnInit} from '@angular/core';
import {SourceCodeService} from '../../../shared/source-code.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {ComponentPreviewComponent} from '../../../shared/component-preview/component-preview.component';
import {MonthPickerComponent} from '../../../docs-examples/date-picker/month-picker/month-picker.component';

@Component({
  selector: 'app-month-pick-doc',
  standalone: true,
  imports: [
    AsyncPipe,
    ComponentPreviewComponent,
    MonthPickerComponent
  ],
  templateUrl: './month-pick-doc.component.html',
  styleUrl: './month-pick-doc.component.css'
})
export class MonthPickDocComponent implements OnInit {
  sourceService = inject(SourceCodeService);
  htmlCode$!: Observable<string>;
  jsCode$!: Observable<string>;

  ngOnInit(): void {
    this.htmlCode$ = this.sourceService.getFile('date-picker/month-picker/month-picker.component.html');
    this.jsCode$ = this.sourceService.getFile('date-picker/month-picker/month-picker.component.ts');
  }
}
