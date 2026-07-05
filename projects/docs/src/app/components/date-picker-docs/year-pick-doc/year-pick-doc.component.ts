import { Component, inject, OnInit } from '@angular/core';
import { SourceCodeService } from '../../../shared/source-code.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { YearPickerComponent } from '../../../docs-examples/date-picker/year-picker/year-picker.component';

@Component({
  selector: 'app-year-pick-doc',
  standalone: true,
  imports: [
    AsyncPipe,
    ComponentPreviewComponent,
    YearPickerComponent
  ],
  templateUrl: './year-pick-doc.component.html',
  styleUrl: './year-pick-doc.component.css'
})
export class YearPickDocComponent implements OnInit {
  sourceService = inject(SourceCodeService);
  htmlCode$!: Observable<string>;
  jsCode$!: Observable<string>;

  ngOnInit(): void {
    this.htmlCode$ = this.sourceService.getFile('date-picker/year-picker/year-picker.component.html');
    this.jsCode$ = this.sourceService.getFile('date-picker/year-picker/year-picker.component.ts');
  }
}
