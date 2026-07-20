import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicChartSparkComponent } from '../../docs-examples/chart-spark/basic-chart-spark/basic-chart-spark.component';
import { ChartSparkTypesComponent } from '../../docs-examples/chart-spark/chart-spark-types/chart-spark-types.component';
import { ChartSparkInAListComponent } from '../../docs-examples/chart-spark/chart-spark-in-a-list/chart-spark-in-a-list.component';

@Component({
  selector: 'app-chart-spark-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicChartSparkComponent,
    ChartSparkTypesComponent,
    ChartSparkInAListComponent
  ],
  templateUrl: './chart-spark-docs.component.html',
  styleUrl: './chart-spark-docs.component.css'
})
export class ChartSparkDocsComponent {
  baseService = inject(BaseService);

  installation = `import { ChartSparkComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [ChartSparkComponent]
})`;

  anatomyCode = `<!-- One element. No grid, axis or legend children — a sparkline is chrome-free
     by definition. -->
<tolle-chart-spark [data]="days" valueKey="visits" xKey="day" curve="smooth" />`;

  basicCode = `<div class="w-40">
  <tolle-chart-spark [data]="days" valueKey="visits" xKey="day" curve="smooth"
    ariaLabel="Visits, last 7 days" />
</div>`;

  typesCode = `<tolle-chart-spark [data]="days" valueKey="visits" xKey="day" type="line" curve="smooth" />
<tolle-chart-spark [data]="days" valueKey="visits" xKey="day" type="area" curve="smooth" />
<tolle-chart-spark [data]="days" valueKey="visits" xKey="day" type="bar" />`;

  inAListCode = `<div class="flex items-center gap-4 p-3">
  <div class="min-w-0 flex-1">
    <p class="truncate text-sm font-medium text-foreground">{{ row.product }}</p>
    <p class="text-xs text-muted-foreground">{{ row.latest }}</p>
  </div>
  <div class="w-20">
    <tolle-chart-spark [data]="row.trend" valueKey="revenue" xKey="week" curve="smooth"
      [ariaLabel]="row.product + ' revenue trend'" />
  </div>
</div>`;

  chartSparkProps: PropEntry[] = [
    { name: 'data', type: 'Record<string, any>[]', default: '[]', description: 'Rows to plot, in x order.' },
    { name: 'valueKey', type: 'string', default: "'value'", description: "Row key holding each row's numeric value. This is also the series key, so it must match a real property on your data." },
    { name: 'xKey', type: 'string', default: "''", description: 'Row key holding each row’s x position. Only matters once hover is turned on — nothing renders it otherwise.' },
    { name: 'type', type: "'line' | 'area' | 'bar'", default: "'line'", description: 'Which mark to draw.' },
    { name: 'curve', type: "'linear' | 'smooth'", default: "'linear'", description: 'Interpolation for line/area.' },
    { name: 'maxBarWidth', type: 'number', default: '6', description: "Largest bar thickness in px, used when type is 'bar'." },
    { name: 'height', type: 'number', default: '32', description: 'Height in px.' },
    { name: 'hover', type: 'boolean', default: 'false', description: 'Renders the crosshair, hit layer and tooltip — off by default, since a sparkline is usually too small to hover precisely.' },
    { name: 'showTable', type: 'boolean', default: 'false', description: 'Shows the data table instead of leaving it visually hidden. The table is always rendered and always referenced by aria-describedby.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name, used as the svg <title>.' },
    { name: 'description', type: 'string', default: "''", description: 'Longer summary used as the svg <desc>. Falls back to ariaLabel.' },
    { name: 'margin', type: 'ChartMargin', default: '{ top: 2, right: 2, bottom: 2, left: 2 }', description: 'Space reserved around the plot — a sparkline has no axis labels to fit, so this stays tight.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes, merged with cn() (last-wins).' }
  ];
}
