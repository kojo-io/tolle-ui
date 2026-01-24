import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicMultiSelectExampleComponent } from '../../../docs-examples/multi-select/basic-multi-select-example/basic-multi-select-example.component';

@Component({
    selector: 'app-multi-select-overview',
    standalone: true,
    imports: [AsyncPipe, BaseEditorComponent, BasicMultiSelectExampleComponent],
    templateUrl: './multi-select-overview.component.html'
})
export class MultiSelectOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    sourceCode$ = this.sourceCodeService.getFile('docs-examples/multi-select/basic-multi-select-example/basic-multi-select-example.component.ts');
}
