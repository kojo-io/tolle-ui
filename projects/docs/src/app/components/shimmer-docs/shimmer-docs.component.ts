import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicShimmerComponent } from '../../docs-examples/shimmer/basic-shimmer/basic-shimmer.component';
import { ShimmerSizesComponent } from '../../docs-examples/shimmer/shimmer-sizes/shimmer-sizes.component';
import { ShimmerSettledComponent } from '../../docs-examples/shimmer/shimmer-settled/shimmer-settled.component';


@Component({
  selector: 'app-shimmer-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicShimmerComponent,
    ShimmerSizesComponent,
    ShimmerSettledComponent
  ],
  templateUrl: './shimmer-docs.component.html',
  styleUrl: './shimmer-docs.component.css'
})
export class ShimmerDocsComponent {
  baseService = inject(BaseService);

  installation = `import { ShimmerComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [ShimmerComponent]
})`;

  basicCode = `<tolle-shimmer>Thinking…</tolle-shimmer>
<tolle-shimmer>Generating response…</tolle-shimmer>
<tolle-shimmer>Searching the documentation…</tolle-shimmer>`;

  sizesCode = `<tolle-shimmer size="xs">Extra small status</tolle-shimmer>
<tolle-shimmer size="sm">Small status</tolle-shimmer>
<tolle-shimmer size="default">Default status</tolle-shimmer>
<tolle-shimmer size="lg">Large status</tolle-shimmer>
<tolle-shimmer size="xl">Extra large status</tolle-shimmer>`;

  settledCode = `<tolle-shimmer [active]="streaming" size="sm">{{ label }}</tolle-shimmer>

<tolle-button variant="outline" size="sm" (click)="toggle()">
  {{ streaming ? 'Finish streaming' : 'Start streaming' }}
</tolle-button>`;

  settledTs = `export class ShimmerSettledComponent {
  streaming = true;

  get label(): string {
    return this.streaming ? 'Generating response…' : 'Generated response';
  }

  toggle(): void {
    this.streaming = !this.streaming;
  }
}`;

  shimmerProps: PropEntry[] = [
    { name: 'active', type: 'boolean', default: 'true', description: 'Runs the shimmer animation. When false the same text renders plain and static, so the label can stay mounted as the state settles.' },
    { name: 'size', type: "'xs' | 'sm' | 'default' | 'lg' | 'xl'", default: "'default'", description: 'Text size of the label.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the label (last-wins).' }
  ];
}
