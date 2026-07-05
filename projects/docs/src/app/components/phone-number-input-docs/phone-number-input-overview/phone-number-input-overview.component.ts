import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';
import { BasicPhoneNumberInputExampleComponent } from '../../../docs-examples/phone-number-input/basic-phone-number-input-example/basic-phone-number-input-example.component';

@Component({
    selector: 'app-phone-number-input-overview',
    standalone: true,
    imports: [CommonModule, AsyncPipe, BaseEditorComponent, ComponentPreviewComponent, DocHeroComponent, BasicPhoneNumberInputExampleComponent],
    templateUrl: './phone-number-input-overview.component.html'
})
export class PhoneNumberInputOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('docs-examples/phone-number-input/basic-phone-number-input-example/basic-phone-number-input-example.component.ts');
}
