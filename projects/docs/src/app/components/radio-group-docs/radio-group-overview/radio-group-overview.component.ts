import { Component, inject } from '@angular/core';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicRadioGroupExampleComponent } from '../../../docs-examples/radio-group/basic-radio-group-example/basic-radio-group-example.component';
import { AsyncPipe } from '@angular/common';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
    selector: 'app-radio-group-overview',
    standalone: true,
    imports: [
        BasicRadioGroupExampleComponent,
        AsyncPipe,
        BaseEditorComponent
    ],
    templateUrl: './radio-group-overview.component.html'
})
export class RadioGroupOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    sourceCode$ = this.sourceCodeService.getFile('docs-examples/radio-group/basic-radio-group-example/basic-radio-group-example.component.ts');
}
