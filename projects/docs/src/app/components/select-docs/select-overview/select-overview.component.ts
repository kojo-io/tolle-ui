import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicSelectExampleComponent } from '../../../docs-examples/select/basic-select-example/basic-select-example.component';

@Component({
    selector: 'app-select-overview',
    standalone: true,
    imports: [AsyncPipe, BaseEditorComponent, BasicSelectExampleComponent],
    templateUrl: './select-overview.component.html'
})
export class SelectOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    sourceCode$ = this.sourceCodeService.getFile('docs-examples/select/basic-select-example/basic-select-example.component.ts');
}
