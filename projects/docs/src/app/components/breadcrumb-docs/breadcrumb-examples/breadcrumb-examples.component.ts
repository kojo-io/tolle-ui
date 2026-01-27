import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicBreadcrumbComponent } from '../../../docs-examples/breadcrumb/basic-breadcrumb.component';
import { CustomSeparatorBreadcrumbComponent } from '../../../docs-examples/breadcrumb/custom-separator-breadcrumb.component';

@Component({
    selector: 'app-breadcrumb-examples',
    imports: [
        CommonModule,
        FormsModule,
        SegmentedComponent,
        BaseEditorComponent,
        BasicBreadcrumbComponent,
        CustomSeparatorBreadcrumbComponent
    ],
    templateUrl: './breadcrumb-examples.component.html'
})
export class BreadcrumbExamplesComponent {
  sourceService = inject(SourceCodeService);

  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  basicTab = 'preview';
  separatorTab = 'preview';

  basicCode = '';
  separatorCode = '';

  constructor() {
    this.sourceService.getFile('breadcrumb/basic-breadcrumb.component.ts').subscribe(code => this.basicCode = code);
    this.sourceService.getFile('breadcrumb/custom-separator-breadcrumb.component.ts').subscribe(code => this.separatorCode = code);
  }
}
