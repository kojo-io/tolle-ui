import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicMarkerComponent } from '../../docs-examples/marker/basic-marker/basic-marker.component';
import { MarkerGroupExampleComponent } from '../../docs-examples/marker/marker-group/marker-group.component';
import { MarkerInTranscriptComponent } from '../../docs-examples/marker/marker-in-transcript/marker-in-transcript.component';


@Component({
  selector: 'app-marker-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicMarkerComponent,
    MarkerGroupExampleComponent,
    MarkerInTranscriptComponent
  ],
  templateUrl: './marker-docs.component.html',
  styleUrl: './marker-docs.component.css'
})
export class MarkerDocsComponent {
  baseService = inject(BaseService);

  installation = `import { MarkerComponent, MarkerGroupComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [MarkerComponent, MarkerGroupComponent]
})`;

  basicCode = `<tolle-marker variant="separator" label="Yesterday" />
<tolle-marker variant="default" icon="ri-information-line" label="Ada joined the conversation" />
<tolle-marker variant="status" icon="ri-loader-4-line" label="Thinking…" [shimmer]="true" />
<tolle-marker variant="error" icon="ri-error-warning-line" label="Message failed to send" />`;

  groupCode = `<tolle-marker-group class="rounded-lg border border-border bg-muted/30 p-3">
  <tolle-marker variant="status" icon="ri-search-line" label="Searching the codebase for “parseHeader”" />
  <tolle-marker variant="status" icon="ri-file-list-2-line" label="Read 3 files" />
  <tolle-marker variant="status" icon="ri-terminal-box-line" label="Ran the parser test suite" />
  <tolle-marker variant="default" icon="ri-check-line" label="Done in 4.1s" />
</tolle-marker-group>`;

  transcriptCode = `<tolle-marker variant="separator" label="Today" />

<tolle-message align="start">
  <tolle-message-avatar>AL</tolle-message-avatar>
  <tolle-message-content>
    <tolle-bubble align="start">Why is the import failing on line 40?</tolle-bubble>
  </tolle-message-content>
</tolle-message>

<tolle-marker variant="default" icon="ri-tools-line" label="Inspected import-resolver.ts" />

<tolle-marker variant="status" icon="ri-loader-4-line" label="Preparing a patch…" [shimmer]="true" />`;

  markerProps: PropEntry[] = [
    { name: 'variant', type: "'default' | 'separator' | 'status' | 'error'", default: "'default'", description: "Kind of row: 'default' for a centred system note, 'separator' for a labelled rule, 'status' for live activity on the leading edge, 'error' for a failure." },
    { name: 'label', type: 'string', default: "''", description: 'Text for the marker — the date on a separator, or the status wording. Projected content is rendered after it.' },
    { name: 'icon', type: 'string', default: "''", description: "Remixicon class for a leading icon, e.g. 'ri-tools-line'." },
    { name: 'shimmer', type: 'boolean', default: 'false', description: 'Applies the shimmer text sweep, for live status such as "Thinking…".' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the row.' }
  ];

  groupProps: PropEntry[] = [
    { name: 'class', type: 'string', description: 'Additional CSS classes for the group.' }
  ];

  a11y: PropEntry[] = [
    { name: 'role="separator"', type: 'applied automatically', description: "Set on the 'separator' variant, which also draws a rule on each side of the label." },
    { name: 'role="status" + aria-live="polite"', type: 'applied automatically', description: "Set on the 'status' and 'error' variants, so a changing label is announced without interrupting the reader." }
  ];
}
