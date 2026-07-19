import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicPlanComponent } from '../../docs-examples/plan/basic-plan/basic-plan.component';
import { PlanCollapsedComponent } from '../../docs-examples/plan/plan-collapsed/plan-collapsed.component';

@Component({
  selector: 'app-plan-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicPlanComponent,
    PlanCollapsedComponent
  ],
  templateUrl: './plan-docs.component.html',
  styleUrl: './plan-docs.component.css'
})
export class PlanDocsComponent {
  baseService = inject(BaseService);

  installation = `import { PlanComponent, PlanStepComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [PlanComponent, PlanStepComponent]
})`;

  basicCode = `<tolle-plan title="Migration plan">
  <tolle-plan-step label="Read the existing schema" status="done" />
  <tolle-plan-step label="Generate migration files" status="active" />
  <tolle-plan-step label="Run against staging" status="pending" />
  <tolle-plan-step label="Backfill legacy rows" status="skipped" />
</tolle-plan>`;

  collapsedCode = `<tolle-plan title="Release checklist" size="sm" [(collapsed)]="collapsed">
  <tolle-plan-step label="Bump version" status="done" />
  <tolle-plan-step label="Build the library" status="done" />
  <tolle-plan-step label="Publish to npm" status="active" />
  <tolle-plan-step label="Tag the release" status="pending" />
</tolle-plan>`;

  planProps: PropEntry[] = [
    { name: 'title', type: 'string', default: "'Plan'", description: 'Heading for the plan.' },
    { name: 'collapsed', type: 'boolean', default: 'false', description: 'Collapses to a "Step N of M" summary. Supports two-way binding.' },
    { name: 'collapsible', type: 'boolean', default: 'true', description: 'Allows the user to collapse and expand the plan.' },
    { name: 'size', type: "'sm' | 'default'", default: "'default'", description: 'Density of the plan steps.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the plan.' }
  ];

  planEvents: PropEntry[] = [
    { name: 'collapsedChange', type: 'EventEmitter<boolean>', description: 'Two-way binding partner for collapsed.' }
  ];

  stepProps: PropEntry[] = [
    { name: 'label', type: 'string', default: "''", description: 'What this step does.' },
    { name: 'description', type: 'string', default: "''", description: 'Optional detail shown beneath the label.' },
    { name: 'status', type: "'pending' | 'active' | 'done' | 'skipped'", default: "'pending'", description: 'Drives the marker icon and colour.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the step.' }
  ];
}
