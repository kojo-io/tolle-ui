import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../../shared/base.service';
import { SourceCodeService } from '../../../shared/source-code.service';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';
import { Observable } from 'rxjs';
import { BasicInputExampleComponent } from '../../../docs-examples/input/basic-input-example/basic-input-example.component';

@Component({
    selector: 'app-input-overview',
    standalone: true,
    imports: [CommonModule, ComponentPreviewComponent, DocHeroComponent, BasicInputExampleComponent],
    templateUrl: './input-overview.component.html'
})
export class InputOverviewComponent implements OnInit {
    baseService = inject(BaseService);
    sourceService = inject(SourceCodeService);

    tsCode$!: Observable<string>;

    ngOnInit() {
        this.tsCode$ = this.sourceService.getFile('input/basic-input-example/basic-input-example.component.ts');
    }
}
