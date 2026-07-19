import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicDirectionComponent } from '../../docs-examples/direction/basic-direction/basic-direction.component';
import { DirectionToggleComponent } from '../../docs-examples/direction/direction-toggle/direction-toggle.component';

@Component({
  selector: 'app-direction-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicDirectionComponent,
    DirectionToggleComponent
  ],
  templateUrl: './direction-docs.component.html',
  styleUrl: './direction-docs.component.css'
})
export class DirectionDocsComponent {
  baseService = inject(BaseService);

  installation = `import { DirectionDirective, DirectionService } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [DirectionDirective]
})`;

  basicCode = `<div [tolleDirection]="'ltr'">
  <p>Everything after the arrow flows left to right →</p>
</div>

<div [tolleDirection]="'rtl'">
  <p>النص العربي يتدفق من اليمين إلى اليسار</p>
</div>`;

  toggleCode = `<tolle-button size="sm" variant="outline" (click)="toggle()">
  Switch to {{ '{{' }} dir === 'ltr' ? 'RTL' : 'LTR' {{ '}}' }}
</tolle-button>

<div [tolleDirection]="dir">
  <tolle-input label="Full name" placeholder="Type here" />
</div>`;

  serviceCode = `export class MyComponent {
  private direction = inject(DirectionService);

  // Emits whenever the nearest publishing tolleDirection changes.
  isRtl$ = this.direction.direction$.pipe(map(d => d === 'rtl'));
}`;

  directionProps: PropEntry[] = [
    { name: 'tolleDirection', type: "'ltr' | 'rtl' | 'auto'", default: "'ltr'", description: 'Writing direction applied to the host element as its dir attribute.' },
    { name: 'tolleDirectionPublish', type: 'boolean', default: 'true', description: 'Publishes the direction to DirectionService so components can adapt. Turn off for a local override that should not affect the app-wide value.' }
  ];

  directionEvents: PropEntry[] = [
    { name: 'directionChange', type: 'EventEmitter<Direction>', description: 'Emitted when the resolved direction changes.' }
  ];
}
