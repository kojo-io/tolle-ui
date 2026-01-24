import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicSegmentExampleComponent } from '../../../docs-examples/segment/basic-segment-example/basic-segment-example.component';

@Component({
    selector: 'app-segment-overview',
    standalone: true,
    imports: [AsyncPipe, BaseEditorComponent, BasicSegmentExampleComponent],
    templateUrl: './segment-overview.component.html'
})
export class SegmentOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('docs-examples/segment/basic-segment-example/basic-segment-example.component.ts');
}
