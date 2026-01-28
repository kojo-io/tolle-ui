import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicPaginationExampleComponent } from '../../../docs-examples/pagination/basic-pagination-example/basic-pagination-example.component';

@Component({
    selector: 'app-pagination-overview',
    imports: [AsyncPipe, BaseEditorComponent, BasicPaginationExampleComponent],
    templateUrl: './pagination-overview.component.html'
})
export class PaginationOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('docs-examples/pagination/basic-pagination-example/basic-pagination-example.component.ts');
}
