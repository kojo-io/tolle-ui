import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { BasicAspectRatioExampleComponent } from '../../../docs-examples/aspect-ratio/basic-aspect-ratio-example/basic-aspect-ratio-example.component';

@Component({
  selector: 'app-aspect-ratio-overview',
  standalone: true,
  imports: [CommonModule, AsyncPipe, BaseEditorComponent, DocHeroComponent, ComponentPreviewComponent, BasicAspectRatioExampleComponent],
  templateUrl: './aspect-ratio-overview.component.html'
})
export class AspectRatioOverviewComponent {
  private sourceService = inject(SourceCodeService);
  basicCode$ = this.sourceService.getFile('docs-examples/aspect-ratio/basic-aspect-ratio-example/basic-aspect-ratio-example.component.ts');
}
