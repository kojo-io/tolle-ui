import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicTooltipExampleComponent } from '../../../docs-examples/tooltip/basic-tooltip-example/basic-tooltip-example.component';

@Component({
    selector: 'app-tooltip-overview',
    imports: [CommonModule, AsyncPipe, BaseEditorComponent, BasicTooltipExampleComponent],
    templateUrl: './tooltip-overview.component.html'
})
export class TooltipOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('docs-examples/tooltip/basic-tooltip-example/basic-tooltip-example.component.ts');
}
