import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicTrackerComponent } from '../../docs-examples/tracker/basic-tracker/basic-tracker.component';
import { TrackerStatusCardComponent } from '../../docs-examples/tracker/tracker-status-card/tracker-status-card.component';

@Component({
  selector: 'app-tracker-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicTrackerComponent,
    TrackerStatusCardComponent
  ],
  templateUrl: './tracker-docs.component.html',
  styleUrl: './tracker-docs.component.css'
})
export class TrackerDocsComponent {
  baseService = inject(BaseService);

  installation = `import { TrackerComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [TrackerComponent]
})`;

  anatomyCode = `data: TrackerBlock[] = [
  { status: 'success', tooltip: '9:00 — Operational' },
  { status: 'error',   tooltip: '10:00 — Outage' },
  { status: 'warning', tooltip: '11:00 — Degraded' }
];`;

  basicCode = `<tolle-tracker [data]="hours" ariaLabel="Uptime, last 24 hours" />`;

  statusCardCode = `<div class="rounded-lg border border-border p-4">
  <div class="mb-3 flex items-center justify-between">
    <p class="text-sm font-medium text-foreground">API</p>
    <p class="text-sm text-muted-foreground">{{ uptime }} uptime</p>
  </div>
  <tolle-tracker [data]="days" [blockHeight]="24" ariaLabel="API uptime, last 30 days" />
</div>`;

  trackerProps: PropEntry[] = [
    { name: 'data', type: 'TrackerBlock[]', default: '[]', description: 'One block per period, in chronological order.' },
    { name: 'blockHeight', type: 'number', default: '32', description: 'Height of each block in px.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name for the whole strip.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes, merged with cn() (last-wins).' }
  ];

  trackerTypes: PropEntry[] = [
    { name: 'TrackerBlock', type: "{ status?: TrackerStatus; color?: string; tooltip?: string }", description: 'One block: its health, an optional colour override, and the tooltip naming it.' },
    { name: 'TrackerStatus', type: "'success' | 'warning' | 'error' | 'neutral'", description: 'Maps to the theme’s semantic status tokens (--success, --warning, --destructive, --muted) rather than the chart palette — a status is a state, not a category.' }
  ];
}
