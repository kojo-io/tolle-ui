import { Component, inject } from '@angular/core';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicRadioGroupExampleComponent } from '../../../docs-examples/radio-group/basic-radio-group-example/basic-radio-group-example.component';
import { AsyncPipe } from '@angular/common';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
    selector: 'app-radio-group-overview',
    standalone: true,
    imports: [
        BasicRadioGroupExampleComponent,
        AsyncPipe,
        ComponentPreviewComponent,
        DocHeroComponent
    ],
    templateUrl: './radio-group-overview.component.html'
})
export class RadioGroupOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    sourceCode$ = this.sourceCodeService.getFile('docs-examples/radio-group/basic-radio-group-example/basic-radio-group-example.component.ts');
}
