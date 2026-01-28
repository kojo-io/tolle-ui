import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicPopoverExampleComponent } from '../../../docs-examples/popover/basic-popover-example/basic-popover-example.component';

@Component({
    selector: 'app-popover-overview',
    imports: [AsyncPipe, BaseEditorComponent, BasicPopoverExampleComponent],
    templateUrl: './popover-overview.component.html'
})
export class PopoverOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('docs-examples/popover/basic-popover-example/basic-popover-example.component.ts');
}
