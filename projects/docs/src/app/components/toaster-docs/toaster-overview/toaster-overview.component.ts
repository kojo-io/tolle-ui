import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { BasicToasterExampleComponent } from '../../../docs-examples/toaster/basic-toaster-example/basic-toaster-example.component';

@Component({
  selector: 'app-toaster-overview',
  standalone: true,
  imports: [AsyncPipe, BaseEditorComponent, DocHeroComponent, ComponentPreviewComponent, BasicToasterExampleComponent],
  templateUrl: './toaster-overview.component.html'
})
export class ToasterOverviewComponent {
  private sourceCodeService = inject(SourceCodeService);
  basicCode$ = this.sourceCodeService.getFile('docs-examples/toaster/basic-toaster-example/basic-toaster-example.component.ts');
}
