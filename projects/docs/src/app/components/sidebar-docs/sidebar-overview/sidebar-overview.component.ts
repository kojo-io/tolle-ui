import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicSidebarExampleComponent } from '../../../docs-examples/sidebar/basic-sidebar-example/basic-sidebar-example.component';

@Component({
    selector: 'app-sidebar-overview',
    imports: [AsyncPipe, BaseEditorComponent, BasicSidebarExampleComponent],
    templateUrl: './sidebar-overview.component.html'
})
export class SidebarOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('docs-examples/sidebar/basic-sidebar-example/basic-sidebar-example.component.ts');
}
