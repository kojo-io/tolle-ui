import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicAspectRatioExampleComponent } from '../../../docs-examples/aspect-ratio/basic-aspect-ratio-example/basic-aspect-ratio-example.component';

@Component({
  selector: 'app-aspect-ratio-overview',
  standalone: true,
  imports: [CommonModule, AsyncPipe, BaseEditorComponent, BasicAspectRatioExampleComponent],
  templateUrl: './aspect-ratio-overview.component.html'
})
export class AspectRatioOverviewComponent {
  private sourceService = inject(SourceCodeService);
  basicCode$ = this.sourceService.getFile('docs-examples/aspect-ratio/basic-aspect-ratio-example/basic-aspect-ratio-example.component.ts');
}
