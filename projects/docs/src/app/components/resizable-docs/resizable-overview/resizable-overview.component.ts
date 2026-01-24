import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicResizableExampleComponent } from '../../../docs-examples/resizable/basic-resizable-example/basic-resizable-example.component';

@Component({
    selector: 'app-resizable-overview',
    standalone: true,
    imports: [AsyncPipe, BaseEditorComponent, BasicResizableExampleComponent],
    templateUrl: './resizable-overview.component.html'
})
export class ResizableOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('docs-examples/resizable/basic-resizable-example/basic-resizable-example.component.ts');
}
