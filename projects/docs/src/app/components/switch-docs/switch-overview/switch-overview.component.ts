import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../../shared/base.service';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { Observable } from 'rxjs';
import { BasicSwitchExampleComponent } from '../../../docs-examples/switch/basic-switch-example/basic-switch-example.component';

@Component({
    selector: 'app-switch-overview',
    standalone: true,
    imports: [CommonModule, BaseEditorComponent, BasicSwitchExampleComponent],
    templateUrl: './switch-overview.component.html'
})
export class SwitchOverviewComponent implements OnInit {
    baseService = inject(BaseService);
    sourceService = inject(SourceCodeService);

    tsCode$!: Observable<string>;

    ngOnInit() {
        this.tsCode$ = this.sourceService.getFile('switch/basic-switch-example/basic-switch-example.component.ts');
    }
}
