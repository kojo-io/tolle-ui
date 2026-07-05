import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicCheckboxComponent } from '../../../docs-examples/check-box/basic-checkbox.component';
import { CheckboxWithDescriptionComponent } from '../../../docs-examples/check-box/checkbox-with-description.component';
import { CheckboxDisabledComponent } from '../../../docs-examples/check-box/checkbox-disabled.component';

@Component({
    selector: 'app-check-box-examples',
    standalone: true,
    imports: [
        CommonModule,
        ComponentPreviewComponent,
        BasicCheckboxComponent,
        CheckboxWithDescriptionComponent,
        CheckboxDisabledComponent
    ],
    templateUrl: './check-box-examples.component.html'
})
export class CheckBoxExamplesComponent {
    sourceService = inject(SourceCodeService);

    basicCode = '';
    descriptionCode = '';
    disabledCode = '';

    constructor() {
        this.sourceService.getFile('check-box/basic-checkbox.component.ts').subscribe(code => this.basicCode = code);
        this.sourceService.getFile('check-box/checkbox-with-description.component.ts').subscribe(code => this.descriptionCode = code);
        this.sourceService.getFile('check-box/checkbox-disabled.component.ts').subscribe(code => this.disabledCode = code);
    }
}
