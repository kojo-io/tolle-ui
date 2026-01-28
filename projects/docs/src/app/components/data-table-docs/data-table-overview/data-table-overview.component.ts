import { Component, inject, OnInit } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseService } from '../../../shared/base.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-data-table-overview',
    imports: [
    BaseEditorComponent,
    AsyncPipe
],
    templateUrl: './data-table-overview.component.html'
})
export class DataTableOverviewComponent implements OnInit {
    baseService = inject(BaseService);
    sourceService = inject(SourceCodeService);

    prerequisiteCode$!: Observable<string>;
    columnDefCode$!: Observable<string>;

    ngOnInit(): void {
        this.prerequisiteCode$ = this.sourceService.getFile('data-table/prerequisite.ts');
        this.columnDefCode$ = this.sourceService.getFile('data-table/column-def.ts');
    }
}
