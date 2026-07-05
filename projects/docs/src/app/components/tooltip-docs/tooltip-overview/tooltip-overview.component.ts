import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { BasicTooltipExampleComponent } from '../../../docs-examples/tooltip/basic-tooltip-example/basic-tooltip-example.component';

@Component({
    selector: 'app-tooltip-overview',
    standalone: true,
    imports: [CommonModule, AsyncPipe, BaseEditorComponent, DocHeroComponent, ComponentPreviewComponent, BasicTooltipExampleComponent],
    templateUrl: './tooltip-overview.component.html'
})
export class TooltipOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('docs-examples/tooltip/basic-tooltip-example/basic-tooltip-example.component.ts');
}
