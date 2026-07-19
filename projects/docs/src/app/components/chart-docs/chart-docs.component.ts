import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { ChartLineExampleComponent } from '../../docs-examples/chart/chart-line/chart-line.component';
import { ChartStackedBarComponent } from '../../docs-examples/chart/chart-stacked-bar/chart-stacked-bar.component';
import { ChartAreaExampleComponent } from '../../docs-examples/chart/chart-area/chart-area.component';


@Component({
  selector: 'app-chart-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    ChartLineExampleComponent,
    ChartStackedBarComponent,
    ChartAreaExampleComponent
  ],
  templateUrl: './chart-docs.component.html',
  styleUrl: './chart-docs.component.css'
})
export class ChartDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  ChartComponent,
  ChartGridComponent,
  ChartXAxisComponent,
  ChartYAxisComponent,
  ChartLineComponent,
  ChartAreaComponent,
  ChartBarComponent,
  ChartSeries
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [
    ChartComponent,
    ChartGridComponent,
    ChartXAxisComponent,
    ChartYAxisComponent,
    ChartLineComponent
  ]
})`;

  anatomyCode = `<tolle-chart [data]="months" [series]="series" xKey="month" ariaLabel="Revenue by month">
  <svg:g tolle-chart-grid></svg:g>
  <svg:g tolle-chart-y-axis></svg:g>
  <svg:g tolle-chart-x-axis></svg:g>
  <svg:g tolle-chart-line seriesKey="revenue" curve="smooth"></svg:g>
</tolle-chart>`;

  wrongCode = `<!-- WRONG: renders a blank chart, with no error anywhere -->
<tolle-chart [data]="months" [series]="series" xKey="month">
  <tolle-chart-grid></tolle-chart-grid>
  <tolle-chart-line seriesKey="revenue"></tolle-chart-line>
</tolle-chart>`;

  dataCode = `months = [
  { month: 'Jan', revenue: 18400, expenses: 12100 },
  { month: 'Feb', revenue: 19250, expenses: 12800 },
  { month: 'Mar', revenue: 21800, expenses: 13400 }
];

// A series names the row key to read, and how to label it.
series: ChartSeries[] = [
  { key: 'revenue',  label: 'Revenue' },
  { key: 'expenses', label: 'Expenses' }
];`;

  lineCode = `<tolle-chart [data]="months" [series]="series" xKey="month" [height]="280" xHeader="Month"
  ariaLabel="Revenue and expenses by month"
  description="Revenue climbs from 18,400 in January to 28,400 in August, while expenses rise more slowly.">
  <svg:g tolle-chart-grid></svg:g>
  <svg:g tolle-chart-y-axis></svg:g>
  <svg:g tolle-chart-x-axis></svg:g>
  <svg:g tolle-chart-line seriesKey="revenue" curve="smooth" [showDots]="true"></svg:g>
  <svg:g tolle-chart-line seriesKey="expenses" curve="smooth" [showDots]="true"></svg:g>
</tolle-chart>`;

  barCode = `<tolle-chart [data]="quarters" [series]="series" xKey="quarter" [stacked]="stacked"
  [height]="280" xHeader="Quarter" ariaLabel="Sessions by device and quarter"
  description="Mobile sessions overtake desktop in Q3 and lead by Q4.">
  <svg:g tolle-chart-grid></svg:g>
  <svg:g tolle-chart-y-axis></svg:g>
  <svg:g tolle-chart-x-axis></svg:g>
  <svg:g tolle-chart-bar seriesKey="desktop"></svg:g>
  <svg:g tolle-chart-bar seriesKey="mobile"></svg:g>
  <svg:g tolle-chart-bar seriesKey="tablet"></svg:g>
</tolle-chart>`;

  areaCode = `<tolle-chart [data]="weeks" [series]="series" xKey="week" [stacked]="true"
  [height]="280" [showTable]="true" xHeader="Week" variant="card"
  ariaLabel="Active accounts by week"
  description="Total active accounts grow from 500 in week 1 to 1,055 in week 8.">
  <svg:g tolle-chart-grid></svg:g>
  <svg:g tolle-chart-y-axis></svg:g>
  <svg:g tolle-chart-x-axis></svg:g>
  <svg:g tolle-chart-area seriesKey="trial" curve="smooth"></svg:g>
  <svg:g tolle-chart-area seriesKey="paid" curve="smooth"></svg:g>
</tolle-chart>`;

  colourCode = `// Colour is keyed by series key, not by index in this array.
// Dropping 'expenses' leaves 'revenue' and 'margin' exactly as they were.
visible: ChartSeries[] = [
  { key: 'revenue',  label: 'Revenue' },   // --chart-1
  { key: 'expenses', label: 'Expenses' },  // --chart-2
  { key: 'margin',   label: 'Margin' }     // --chart-3
];`;

  a11yCode = `<tolle-chart
  [data]="months"
  [series]="series"
  xKey="month"
  xHeader="Month"
  ariaLabel="Revenue and expenses by month"
  description="Revenue climbs from 18,400 in January to 28,400 in August, while expenses rise more slowly from 12,100 to 16,700."
  [showTable]="true">
  <svg:g tolle-chart-grid></svg:g>
  <svg:g tolle-chart-y-axis></svg:g>
  <svg:g tolle-chart-x-axis></svg:g>
  <svg:g tolle-chart-line seriesKey="revenue"></svg:g>
  <svg:g tolle-chart-line seriesKey="expenses"></svg:g>
</tolle-chart>`;

  chartProps: PropEntry[] = [
    { name: 'data', type: 'Record<string, any>[]', default: '[]', description: 'Rows to plot, in x order. Missing or non-numeric values are treated as gaps rather than zeros.' },
    { name: 'series', type: 'ChartSeries[]', default: '[]', description: 'Series to draw, in the order they take palette steps --chart-1 through --chart-5.' },
    { name: 'xKey', type: 'string', default: "''", description: "Row key holding each row's x category label." },
    { name: 'height', type: 'number', default: '260', description: 'Height of the chart in px. Width is measured from the container with a ResizeObserver.' },
    { name: 'margin', type: 'ChartMargin', default: '{ top: 8, right: 8, bottom: 24, left: 44 }', description: 'Space reserved around the plot for axis labels. Widen left when the y labels are long.' },
    { name: 'stacked', type: 'boolean', default: 'false', description: 'Stacks marks on a shared baseline instead of grouping them. Respected by both bars and areas.' },
    { name: 'hover', type: 'boolean', default: 'true', description: 'Renders the crosshair, the pointer hit layer and the shared tooltip.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name for the chart, used as the svg <title>.' },
    { name: 'description', type: 'string', default: "''", description: 'Longer summary used as the svg <desc>. Falls back to ariaLabel.' },
    { name: 'showTable', type: 'boolean', default: 'false', description: 'Shows the data table instead of leaving it visually hidden. The table is always rendered and always referenced by aria-describedby.' },
    { name: 'xHeader', type: 'string', default: "'Category'", description: 'Column header the table fallback gives the x category.' },
    { name: 'variant', type: "'default' | 'card'", default: "'default'", description: 'Visual treatment of the chart frame.' },
    { name: 'density', type: "'default' | 'compact'", default: "'default'", description: 'Text density of the chart chrome.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes, merged with cn() (last-wins).' }
  ];

  chartOutputs: PropEntry[] = [
    { name: 'activeIndexChange', type: 'EventEmitter<number | null>', description: 'Emitted with the hovered row index, or null when the pointer leaves. Use it to drive a readout of your own outside the chart.' }
  ];

  gridProps: PropEntry[] = [
    { name: 'vertical', type: 'boolean', default: 'false', description: 'Also draws a rule at every x position, not just at the y ticks.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes merged onto each rule.' }
  ];

  xAxisProps: PropEntry[] = [
    { name: 'charWidth', type: 'number', default: '7', description: 'Approximate px per character, used to decide when labels would collide. A dense axis thins itself out — every nth label — rather than overprinting.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes merged onto each label.' }
  ];

  yAxisProps: PropEntry[] = [
    { name: 'offset', type: 'number', default: '8', description: 'Gap in px between the labels and the plot edge.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes merged onto each label.' }
  ];

  lineProps: PropEntry[] = [
    { name: 'seriesKey', type: 'string', default: "''", description: 'Key of the series to draw. Must match a key in the container’s series array.' },
    { name: 'curve', type: "'linear' | 'smooth'", default: "'linear'", description: 'Interpolation between points. Smooth is monotone cubic (Fritsch-Carlson), so the curve never overshoots and never invents a peak that was not measured.' },
    { name: 'showDots', type: 'boolean', default: 'false', description: 'Draws a marker at every point.' },
    { name: 'dotRadius', type: 'number', default: '4', description: 'Marker radius in px; 4 gives the 8px minimum diameter.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes merged onto the path.' }
  ];

  areaProps: PropEntry[] = [
    { name: 'seriesKey', type: 'string', default: "''", description: 'Key of the series to draw.' },
    { name: 'curve', type: "'linear' | 'smooth'", default: "'linear'", description: 'Interpolation between points.' },
    { name: 'fillOpacity', type: 'number', default: '0.1', description: 'Opacity of the fill — a wash under a 2px stroke, never a saturated block.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes merged onto the stroke.' }
  ];

  barProps: PropEntry[] = [
    { name: 'seriesKey', type: 'string', default: "''", description: 'Key of the series to draw.' },
    { name: 'radius', type: 'number', default: '4', description: 'Corner radius on the data end in px. The baseline end stays square, so a negative value rounds downward instead.' },
    { name: 'maxWidth', type: 'number', default: '24', description: 'Largest bar thickness in px. A wider band becomes air, not a fatter bar.' },
    { name: 'gap', type: 'number', default: '2', description: 'Gap in px between adjacent bars and between stacked segments. The gap comes off the data end, so what separates segments is surface rather than a stroke.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes merged onto each bar.' }
  ];

  chartTypes: PropEntry[] = [
    { name: 'ChartSeries', type: '{ key: string; label: string }', description: 'One plotted series: which row key to read, and how to name it in the legend, tooltip and table.' },
    { name: 'ChartMargin', type: '{ top; right; bottom; left }', description: 'Space reserved around the plot area for axes and labels.' },
    { name: 'ChartTick', type: '{ value: number; y: number; label: string }', description: 'A y-axis tick: its data value, its resolved svg y, and its formatted label.' },
    { name: 'ChartBand', type: '{ start: number; centre: number; width: number }', description: 'A horizontal slice of the plot belonging to one x position.' },
    { name: 'ChartService', type: 'class', description: 'Owns layout, scales and colour assignment for one chart. Provided on ChartComponent, so each chart gets its own instance. Inject it from a custom mark to draw into the same coordinate space.' },
    { name: 'CHART_COLOR_LIMIT', type: 'number', default: '5', description: 'Number of chart palette steps that exist. A sixth series does not get a generated colour.' },
    { name: 'CHART_OVERFLOW_COLOR', type: 'string', description: 'The neutral paint used past the palette limit: rgb(var(--muted-foreground)).' }
  ];
}
