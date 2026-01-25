import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicContextMenuExampleComponent } from '../../../docs-examples/context-menu/basic-context-menu/basic-context-menu.component';

@Component({
    selector: 'app-context-menu-overview',
    standalone: true,
    imports: [CommonModule, AsyncPipe, BaseEditorComponent, BasicContextMenuExampleComponent],
    templateUrl: './context-menu-overview.component.html'
})
export class ContextMenuOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('docs-examples/context-menu/basic-context-menu/basic-context-menu.component.ts');
}
