import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { BasicPaginationExampleComponent } from '../../../docs-examples/pagination/basic-pagination-example/basic-pagination-example.component';

@Component({
    selector: 'app-pagination-overview',
    standalone: true,
    imports: [AsyncPipe, BaseEditorComponent, DocHeroComponent, ComponentPreviewComponent, BasicPaginationExampleComponent],
    templateUrl: './pagination-overview.component.html'
})
export class PaginationOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('docs-examples/pagination/basic-pagination-example/basic-pagination-example.component.ts');
}
