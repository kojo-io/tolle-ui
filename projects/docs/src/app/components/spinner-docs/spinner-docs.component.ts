import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicSpinnerComponent } from '../../docs-examples/spinner/basic-spinner/basic-spinner.component';
import { SpinnerSizesComponent } from '../../docs-examples/spinner/spinner-sizes/spinner-sizes.component';
import { SpinnerInButtonComponent } from '../../docs-examples/spinner/spinner-in-button/spinner-in-button.component';


@Component({
  selector: 'app-spinner-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicSpinnerComponent,
    SpinnerSizesComponent,
    SpinnerInButtonComponent
  ],
  templateUrl: './spinner-docs.component.html',
  styleUrl: './spinner-docs.component.css'
})
export class SpinnerDocsComponent {
  baseService = inject(BaseService);

  installation = `import { SpinnerComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [SpinnerComponent]
})`;

  basicCode = `<tolle-spinner />
<tolle-spinner variant="primary" />
<tolle-spinner variant="muted" />
<tolle-spinner variant="destructive" />`;

  sizesCode = `<tolle-spinner size="xs" />
<tolle-spinner size="sm" />
<tolle-spinner size="default" />
<tolle-spinner size="lg" />
<tolle-spinner size="xl" />`;

  buttonCode = `<tolle-button [disabled]="true">
  <tolle-spinner size="xs" label="Saving" class="mr-2" />
  Saving
</tolle-button>`;

  spinnerProps: PropEntry[] = [
    { name: 'size', type: "'xs' | 'sm' | 'default' | 'lg' | 'xl'", default: "'default'", description: 'Diameter of the spinner.' },
    { name: 'variant', type: "'default' | 'primary' | 'muted' | 'destructive'", default: "'default'", description: 'Colour of the spinner, inherited from the theme tokens.' },
    { name: 'label', type: 'string', default: "'Loading'", description: 'Accessible label announced while the spinner is visible.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the spinner.' }
  ];
}
