import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicEmptyStateComponent } from '../../../docs-examples/empty-state/basic-empty-state/basic-empty-state.component';

@Component({
    selector: 'app-empty-state-overview',
    standalone: true,
    imports: [CommonModule, AsyncPipe, BaseEditorComponent, BasicEmptyStateComponent],
    templateUrl: './empty-state-overview.component.html'
})
export class EmptyStateOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('empty-state/basic-empty-state/basic-empty-state.component.ts');
}
