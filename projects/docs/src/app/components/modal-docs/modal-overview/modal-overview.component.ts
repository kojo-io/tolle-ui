import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicModalComponent } from '../../../docs-examples/modal/basic-modal/basic-modal.component';
import { TemplateModalComponent } from '../../../docs-examples/modal/template-modal/template-modal.component';
import { ComponentModalComponent } from '../../../docs-examples/modal/component-modal/component-modal.component';

@Component({
    selector: 'app-modal-overview',
    imports: [
        CommonModule,
        AsyncPipe,
        BaseEditorComponent,
        BasicModalComponent,
        TemplateModalComponent,
        ComponentModalComponent
    ],
    templateUrl: './modal-overview.component.html'
})
export class ModalOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('modal/basic-modal/basic-modal.component.ts');
    templateCode$ = this.sourceCodeService.getFile('modal/template-modal/template-modal.component.ts');
    componentCode$ = this.sourceCodeService.getFile('modal/component-modal/component-modal.component.ts');
}
