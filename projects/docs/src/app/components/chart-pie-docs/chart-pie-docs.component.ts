import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicChartPieComponent } from '../../docs-examples/chart-pie/basic-chart-pie/basic-chart-pie.component';
import { ChartPieDonutComponent } from '../../docs-examples/chart-pie/chart-pie-donut/chart-pie-donut.component';
import { ChartPieManySlicesComponent } from '../../docs-examples/chart-pie/chart-pie-many-slices/chart-pie-many-slices.component';


@Component({
  selector: 'app-chart-pie-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicChartPieComponent,
    ChartPieDonutComponent,
    ChartPieManySlicesComponent
  ],
  templateUrl: './chart-pie-docs.component.html',
  styleUrl: './chart-pie-docs.component.css'
})
export class ChartPieDocsComponent {
  baseService = inject(BaseService);

  installation = `import { ChartPieComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [ChartPieComponent]
})`;

  anatomyCode = `<!-- One element. The legend, the tooltip and the data table
     are rendered by the component; do not project them. -->
<tolle-chart-pie
  [data]="traffic"
  labelKey="source"
  valueKey="sessions"
  ariaLabel="Sessions by traffic source" />`;

  dataCode = `traffic = [
  { source: 'Organic search', sessions: 4820 },
  { source: 'Direct',         sessions: 2140 },
  { source: 'Referral',       sessions: 1275 },
  { source: 'Social',         sessions: 640 }
];`;

  basicCode = `<tolle-chart-pie
  [data]="traffic"
  labelKey="source"
  valueKey="sessions"
  labelHeader="Source"
  valueHeader="Sessions"
  ariaLabel="Sessions by traffic source"
  description="Organic search accounts for just under half of all sessions." />`;

  donutCode = `<div class="relative">
  <tolle-chart-pie
    [data]="plans"
    labelKey="plan"
    valueKey="revenue"
    [donut]="true"
    [innerRadius]="0.62"
    labelHeader="Plan"
    valueHeader="Revenue"
    ariaLabel="Monthly recurring revenue by plan" />

  <!-- The hole is yours: overlay a total on the plot area. -->
  <div class="pointer-events-none absolute inset-x-0 top-0 flex h-[240px] flex-col items-center justify-center">
    <span class="text-xs text-muted-foreground">MRR</span>
    <span class="text-xl font-semibold tabular-nums text-foreground">{{ total }}</span>
  </div>
</div>`;

  manySlicesCode = `<tolle-chart-pie
  [data]="data"
  labelKey="region"
  valueKey="users"
  [donut]="true"
  labelHeader="Region"
  valueHeader="Active users"
  ariaLabel="Active users by region" />`;

  manySlicesTsCode = `/** Six categories: one more than the palette has steps. */
private readonly all = [
  { region: 'North America', users: 5210 },
  { region: 'Europe',        users: 4380 },
  { region: 'Asia Pacific',  users: 3140 },
  { region: 'Latin America', users: 1620 },
  { region: 'Middle East',   users: 880 },
  { region: 'Africa',        users: 540 }
];

hidden = new Set<string>();

get data() {
  return this.all.filter((row) => !this.hidden.has(row.region));
}

toggle(region: string): void {
  // Replace the set so the pie's ngOnChanges sees a new \`data\` reference.
  const next = new Set(this.hidden);
  next.has(region) ? next.delete(region) : next.add(region);
  this.hidden = next;
}`;

  a11yCode = `<tolle-chart-pie
  [data]="traffic"
  labelKey="source"
  valueKey="sessions"
  labelHeader="Source"
  valueHeader="Sessions"
  ariaLabel="Sessions by traffic source"
  description="Organic search accounts for 4,820 of 8,875 sessions, ahead of direct at 2,140."
  [showTable]="true" />`;

  pieProps: PropEntry[] = [
    { name: 'data', type: 'Record<string, any>[]', default: '[]', description: 'Rows to plot, one slice each. Values that are not finite and greater than zero are dropped — a pie divides a whole, so a negative share has no meaning in one.' },
    { name: 'valueKey', type: 'string', default: "'value'", description: "Row key holding each slice's numeric value." },
    { name: 'labelKey', type: 'string', default: "'label'", description: "Row key holding each slice's label. Also the identity the palette is keyed by." },
    { name: 'donut', type: 'boolean', default: 'false', description: 'Cuts a hole in the middle, making it a donut.' },
    { name: 'innerRadius', type: 'number', default: '0.6', description: 'Hole size as a fraction of the outer radius, used when donut is set. Clamped to 0.95.' },
    { name: 'size', type: 'number', default: '240', description: 'Width and height of the square plot in px.' },
    { name: 'gap', type: 'number', default: '2', description: 'Angular gap between slices, expressed in px of arc at the outer edge. A sliver always keeps a hairline of itself, so the gap never eats a whole slice.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name for the chart, used as the svg <title>.' },
    { name: 'description', type: 'string', default: "''", description: 'Longer summary used as the svg <desc>. Falls back to ariaLabel.' },
    { name: 'showTable', type: 'boolean', default: 'false', description: 'Shows the data table instead of leaving it visually hidden. The table is always rendered and always referenced by aria-describedby.' },
    { name: 'labelHeader', type: 'string', default: "'Category'", description: 'Column header the table fallback gives the label column.' },
    { name: 'valueHeader', type: 'string', default: "'Value'", description: 'Column header the table fallback gives the value column.' },
    { name: 'variant', type: "'default' | 'card'", default: "'default'", description: 'Visual treatment of the chart frame.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes, merged with cn() (last-wins).' }
  ];

  pieOutputs: PropEntry[] = [
    { name: 'activeIndexChange', type: 'EventEmitter<number | null>', description: 'Emitted with the hovered slice index, or null when the pointer leaves.' }
  ];

  pieExports: PropEntry[] = [
    { name: 'ChartPieSlice', type: 'interface', description: 'One resolved slice: label, value, percent, color, the arc path d, and the anchorX / anchorY the tooltip is placed from.' },
    { name: 'arcPath()', type: '(cx, cy, outer, inner, start, end) => string', description: 'Builds one slice path. A span covering the full circle is drawn as two half arcs, because an SVG arc whose start and end points coincide renders nothing at all.' },
    { name: 'polarPoint()', type: '(cx, cy, r, angle) => [number, number]', description: 'Converts an angle measured clockwise from 12 o’clock into svg coordinates.' },
    { name: 'CHART_COLOR_LIMIT', type: 'number', default: '5', description: 'Number of chart palette steps that exist. A sixth slice does not get a generated colour.' },
    { name: 'CHART_OVERFLOW_COLOR', type: 'string', description: 'The neutral paint used past the palette limit: rgb(var(--muted-foreground)).' }
  ];
}
