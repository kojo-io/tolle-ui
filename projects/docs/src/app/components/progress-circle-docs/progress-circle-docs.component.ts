import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicProgressCircleComponent } from '../../docs-examples/progress-circle/basic-progress-circle/basic-progress-circle.component';
import { ProgressCircleLabelComponent } from '../../docs-examples/progress-circle/progress-circle-label/progress-circle-label.component';
import { ProgressCircleSizesComponent } from '../../docs-examples/progress-circle/progress-circle-sizes/progress-circle-sizes.component';

@Component({
  selector: 'app-progress-circle-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicProgressCircleComponent,
    ProgressCircleLabelComponent,
    ProgressCircleSizesComponent
  ],
  templateUrl: './progress-circle-docs.component.html',
  styleUrl: './progress-circle-docs.component.css'
})
export class ProgressCircleDocsComponent {
  baseService = inject(BaseService);

  installation = `import { ProgressCircleComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [ProgressCircleComponent]
})`;

  anatomyCode = `<!-- Nothing is projected by default — you own the centre, same as
     tolle-chart-pie's donut hole. -->
<tolle-progress-circle [value]="68" />`;

  basicCode = `<tolle-progress-circle [value]="68" />`;

  labelCode = `<tolle-progress-circle [value]="82" [size]="140" [strokeWidth]="10">
  <div class="flex flex-col items-center">
    <span class="text-xl font-semibold tabular-nums text-foreground">82%</span>
    <span class="text-xs text-muted-foreground">Battery</span>
  </div>
</tolle-progress-circle>`;

  sizesCode = `<tolle-progress-circle [value]="55" [size]="56" [strokeWidth]="5" />
<tolle-progress-circle [value]="55" [size]="88" [strokeWidth]="7" />
<tolle-progress-circle [value]="55" [size]="128" [strokeWidth]="10" />`;

  progressCircleProps: PropEntry[] = [
    { name: 'value', type: 'number | null', default: '0', description: 'Percent complete, 0-100. Out-of-range values are clamped; null is treated as 0.' },
    { name: 'size', type: 'number', default: '120', description: 'Diameter of the ring in px.' },
    { name: 'strokeWidth', type: 'number', default: '8', description: 'Thickness of the ring in px.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes, merged with cn() (last-wins).' }
  ];
}
