import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicMaskedInputExampleComponent } from '../../../docs-examples/masked-input/basic-masked-input-example/basic-masked-input-example.component';

@Component({
    selector: 'app-masked-input-overview',
    standalone: true,
    imports: [AsyncPipe, BaseEditorComponent, BasicMaskedInputExampleComponent],
    templateUrl: './masked-input-overview.component.html'
})
export class MaskedInputOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    sourceCode$ = this.sourceCodeService.getFile('docs-examples/masked-input/basic-masked-input-example/basic-masked-input-example.component.ts');
}
