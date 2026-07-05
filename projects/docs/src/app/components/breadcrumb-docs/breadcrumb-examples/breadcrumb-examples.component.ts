import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicBreadcrumbComponent } from '../../../docs-examples/breadcrumb/basic-breadcrumb.component';
import { CustomSeparatorBreadcrumbComponent } from '../../../docs-examples/breadcrumb/custom-separator-breadcrumb.component';

@Component({
  selector: 'app-breadcrumb-examples',
  standalone: true,
  imports: [
    CommonModule,
    ComponentPreviewComponent,
    BasicBreadcrumbComponent,
    CustomSeparatorBreadcrumbComponent
  ],
  templateUrl: './breadcrumb-examples.component.html'
})
export class BreadcrumbExamplesComponent {
  sourceService = inject(SourceCodeService);

  basicCode = '';
  separatorCode = '';

  constructor() {
    this.sourceService.getFile('breadcrumb/basic-breadcrumb.component.ts').subscribe(code => this.basicCode = code);
    this.sourceService.getFile('breadcrumb/custom-separator-breadcrumb.component.ts').subscribe(code => this.separatorCode = code);
  }
}
