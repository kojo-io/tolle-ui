import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicChainOfThoughtComponent } from '../../docs-examples/chain-of-thought/basic-chain-of-thought/basic-chain-of-thought.component';
import { ChainOfThoughtProgressComponent } from '../../docs-examples/chain-of-thought/chain-of-thought-progress/chain-of-thought-progress.component';
import { ChainOfThoughtCollapsedComponent } from '../../docs-examples/chain-of-thought/chain-of-thought-collapsed/chain-of-thought-collapsed.component';


@Component({
  selector: 'app-chain-of-thought-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicChainOfThoughtComponent,
    ChainOfThoughtProgressComponent,
    ChainOfThoughtCollapsedComponent
  ],
  templateUrl: './chain-of-thought-docs.component.html',
  styleUrl: './chain-of-thought-docs.component.css'
})
export class ChainOfThoughtDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  ChainOfThoughtComponent,
  ChainOfThoughtHeaderComponent,
  ChainOfThoughtContentComponent,
  ChainOfThoughtStepComponent,
  ChainOfThoughtSearchResultsComponent,
  ChainOfThoughtSearchResultComponent
} from '@tolle_/tolle-ui';`;

  anatomy = `<tolle-chain-of-thought [open]="true">
  <tolle-chain-of-thought-header label="Thought for 6 seconds" />

  <tolle-chain-of-thought-content>
    <tolle-chain-of-thought-step label="Searched the docs" icon="ri-search-line" status="complete">
      <tolle-chain-of-thought-search-results>
        <tolle-chain-of-thought-search-result>theme.css</tolle-chain-of-thought-search-result>
      </tolle-chain-of-thought-search-results>
    </tolle-chain-of-thought-step>
  </tolle-chain-of-thought-content>
</tolle-chain-of-thought>`;

  basicCode = `<tolle-chain-of-thought [open]="true">
  <tolle-chain-of-thought-header label="Thought for 6 seconds" />

  <tolle-chain-of-thought-content>
    <tolle-chain-of-thought-step label="Read the request" icon="ri-chat-1-line" />

    <tolle-chain-of-thought-step label="Searched the documentation" icon="ri-search-line">
      <tolle-chain-of-thought-search-results>
        <tolle-chain-of-thought-search-result icon="ri-file-text-line">theme.css</tolle-chain-of-thought-search-result>
        <tolle-chain-of-thought-search-result icon="ri-file-text-line">tailwind.config.js</tolle-chain-of-thought-search-result>
      </tolle-chain-of-thought-search-results>
    </tolle-chain-of-thought-step>

    <tolle-chain-of-thought-step label="Wrote the answer" icon="ri-quill-pen-line" />
  </tolle-chain-of-thought-content>
</tolle-chain-of-thought>`;

  progressCode = `<tolle-chain-of-thought [open]="true">
  <tolle-chain-of-thought-header [label]="headerLabel" />

  <tolle-chain-of-thought-content>
    @for (step of steps; track step.label; let i = $index) {
      <tolle-chain-of-thought-step [label]="step.label" [icon]="step.icon" [status]="statusFor(i)" />
    }
  </tolle-chain-of-thought-content>
</tolle-chain-of-thought>`;

  progressTs = `import { ChainOfThoughtStepStatus } from '@tolle_/tolle-ui';

export class ChainOfThoughtProgressComponent {
  readonly steps = [
    { label: 'Parsed the question', icon: 'ri-chat-1-line' },
    { label: 'Queried the pricing table', icon: 'ri-database-2-line' },
    { label: 'Ran the projection', icon: 'ri-line-chart-line' },
    { label: 'Drafted the summary', icon: 'ri-quill-pen-line' }
  ];

  /** Index of the step currently running; steps before it are complete. */
  current = 1;

  statusFor(index: number): ChainOfThoughtStepStatus {
    if (index < this.current) return 'complete';
    if (index === this.current) return 'active';
    return 'pending';
  }
}`;

  collapsedCode = `<tolle-chain-of-thought size="sm" [open]="open" (openChange)="onOpenChange($event)">
  <tolle-chain-of-thought-header label="Chain of Thought" />

  <tolle-chain-of-thought-content>
    <tolle-chain-of-thought-step label="Looked up three sources" icon="ri-search-line" status="complete">
      <tolle-chain-of-thought-search-results>
        @for (source of sources; track source) {
          <tolle-chain-of-thought-search-result icon="ri-links-line">{{ source }}</tolle-chain-of-thought-search-result>
        }
      </tolle-chain-of-thought-search-results>
    </tolle-chain-of-thought-step>

    <tolle-chain-of-thought-step label="Verifying the snippet compiles" icon="ri-terminal-box-line" status="active" />
    <tolle-chain-of-thought-step label="Write the answer" icon="ri-quill-pen-line" status="pending" />
  </tolle-chain-of-thought-content>
</tolle-chain-of-thought>`;

  rootProps: PropEntry[] = [
    { name: 'open', type: 'boolean', default: 'false', description: 'Whether the reasoning steps are expanded. Supports two-way binding with [(open)].' },
    { name: 'size', type: "'sm' | 'default'", default: "'default'", description: 'Text scale of the whole trace.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the trace (last-wins).' }
  ];

  rootOutputs: PropEntry[] = [
    { name: 'openChange', type: 'EventEmitter<boolean>', description: 'Emitted with the new expanded state whenever the trace opens or closes. Mounting never emits.' }
  ];

  headerProps: PropEntry[] = [
    { name: 'label', type: 'string', default: "'Chain of Thought'", description: 'Text shown in the header. Truncates rather than wrapping.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the header (last-wins).' }
  ];

  contentProps: PropEntry[] = [
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the content (last-wins).' }
  ];

  stepProps: PropEntry[] = [
    { name: 'label', type: 'string', default: "''", description: 'Text describing what happened in this step.' },
    { name: 'status', type: "'pending' | 'active' | 'complete'", default: "'complete'", description: 'Progress of this step; drives the marker colour and label weight.' },
    { name: 'icon', type: 'string', default: "'ri-checkbox-blank-circle-fill'", description: 'Remixicon class shown inside the step marker.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the step (last-wins).' }
  ];

  searchResultProps: PropEntry[] = [
    { name: 'icon', type: 'string', default: "''", description: 'Optional remixicon class shown before the chip label.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the chip (last-wins).' }
  ];
}
