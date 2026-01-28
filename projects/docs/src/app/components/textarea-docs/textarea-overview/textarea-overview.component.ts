import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../../shared/base.service';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { Observable } from 'rxjs';
import { BasicTextareaExampleComponent } from '../../../docs-examples/textarea/basic-textarea-example/basic-textarea-example.component';

@Component({
    selector: 'app-textarea-overview',
    imports: [CommonModule, BaseEditorComponent, BasicTextareaExampleComponent],
    templateUrl: './textarea-overview.component.html'
})
export class TextareaOverviewComponent implements OnInit {
    baseService = inject(BaseService);
    sourceService = inject(SourceCodeService);

    tsCode$!: Observable<string>;

    ngOnInit() {
        this.tsCode$ = this.sourceService.getFile('textarea/basic-textarea-example/basic-textarea-example.component.ts');
    }
}
