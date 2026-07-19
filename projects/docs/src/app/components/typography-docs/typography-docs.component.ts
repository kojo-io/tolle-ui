import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicTypographyComponent } from '../../docs-examples/typography/basic-typography/basic-typography.component';
import { TypographyVariantsComponent } from '../../docs-examples/typography/typography-variants/typography-variants.component';
import { TypographyBlockquoteComponent } from '../../docs-examples/typography/typography-blockquote/typography-blockquote.component';


@Component({
  selector: 'app-typography-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicTypographyComponent,
    TypographyVariantsComponent,
    TypographyBlockquoteComponent
  ],
  templateUrl: './typography-docs.component.html',
  styleUrl: './typography-docs.component.css'
})
export class TypographyDocsComponent {
  baseService = inject(BaseService);

  installation = `import { TypographyComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [TypographyComponent]
})`;

  basicCode = `<tolle-typography variant="h1">The Joke Tax Chronicles</tolle-typography>
<tolle-typography variant="lead">
  Once upon a time, in a far-off land, there was a very lazy king.
</tolle-typography>
<tolle-typography variant="h2">The King's Plan</tolle-typography>
<tolle-typography variant="p">
  The king thought long and hard, and finally came up with a brilliant plan.
</tolle-typography>`;

  variantsCode = `<tolle-typography variant="h4">Heading four</tolle-typography>
<tolle-typography variant="large">Large</tolle-typography>
<tolle-typography variant="small">Small</tolle-typography>
<tolle-typography variant="muted">Muted</tolle-typography>
<tolle-typography variant="code">npm install @tolle_/tolle-ui</tolle-typography>`;

  blockquoteCode = `<tolle-typography variant="blockquote">
  "After all," he said, "everyone enjoys a good joke, so it's only fair
  that they should pay for the privilege."
</tolle-typography>`;

  typographyProps: PropEntry[] = [
    { name: 'variant', type: "'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'blockquote' | 'lead' | 'large' | 'small' | 'muted' | 'code'", default: "'p'", description: 'Type scale step; also selects the rendered HTML tag.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the element.' }
  ];

  tagMapping: PropEntry[] = [
    { name: 'h1 – h4', type: '<h1> – <h4>', description: 'Headings stay real headings for assistive tech.' },
    { name: 'blockquote', type: '<blockquote>', description: 'Quoted passage with a leading rule.' },
    { name: 'code', type: '<code>', description: 'Inline code with a muted background.' },
    { name: 'p, lead, large, small, muted', type: '<p>', description: 'Body copy variants; all render as a paragraph.' }
  ];
}
