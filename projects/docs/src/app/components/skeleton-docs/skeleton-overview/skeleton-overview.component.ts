import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicSkeletonExampleComponent } from '../../../docs-examples/skeleton/basic-skeleton-example/basic-skeleton-example.component';

@Component({
    selector: 'app-skeleton-overview',
    imports: [AsyncPipe, BaseEditorComponent, BasicSkeletonExampleComponent],
    templateUrl: './skeleton-overview.component.html'
})
export class SkeletonOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('docs-examples/skeleton/basic-skeleton-example/basic-skeleton-example.component.ts');
}
