import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicDropdownComponent } from '../../../docs-examples/dropdown-menu/basic-dropdown/basic-dropdown.component';

@Component({
    selector: 'app-dropdown-menu-overview',
    imports: [CommonModule, AsyncPipe, BaseEditorComponent, BasicDropdownComponent],
    templateUrl: './dropdown-menu-overview.component.html'
})
export class DropdownMenuOverviewComponent {
  private sourceCodeService = inject(SourceCodeService);
  basicCode$ = this.sourceCodeService.getFile('dropdown-menu/basic-dropdown/basic-dropdown.component.ts');
}
