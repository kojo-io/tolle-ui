import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicRangeComponent } from '../../../docs-examples/date-range-picker/basic-range/basic-range.component';

@Component({
    selector: 'app-date-range-picker-overview',
    standalone: true,
    imports: [CommonModule, AsyncPipe, BaseEditorComponent, BasicRangeComponent],
    templateUrl: './date-range-picker-overview.component.html'
})
export class DateRangePickerOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('date-range-picker/basic-range/basic-range.component.ts');
}
