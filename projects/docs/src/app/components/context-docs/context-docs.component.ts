import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicContextComponent } from '../../docs-examples/context/basic-context/basic-context.component';
import { ContextLevelsComponent } from '../../docs-examples/context/context-levels/context-levels.component';
import { ContextLiveComponent } from '../../docs-examples/context/context-live/context-live.component';


@Component({
  selector: 'app-context-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicContextComponent,
    ContextLevelsComponent,
    ContextLiveComponent
  ],
  templateUrl: './context-docs.component.html',
  styleUrl: './context-docs.component.css'
})
export class ContextDocsComponent {
  baseService = inject(BaseService);

  installation = `import { ContextComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [ContextComponent]
})`;

  anatomy = `<tolle-context
  [used]="82000"
  [total]="128000"
  [inputTokens]="61000"
  [outputTokens]="21000"
  [cost]="0.42" />`;

  basicCode = `<tolle-context
  [used]="42000"
  [total]="200000"
  [inputTokens]="31000"
  [outputTokens]="11000"
  [cost]="0.18" />`;

  levelsCode = `<tolle-context [used]="32000" [total]="128000" placement="right" />   <!-- normal -->
<tolle-context [used]="100000" [total]="128000" placement="right" />  <!-- warning -->
<tolle-context [used]="121000" [total]="128000" placement="right" />  <!-- critical -->`;

  liveCode = `<tolle-context
  [used]="used"
  [total]="total"
  [inputTokens]="inputTokens"
  [outputTokens]="outputTokens"
  [cost]="cost"
  [warningThreshold]="0.6"
  [criticalThreshold]="0.85"
  placement="bottom" />`;

  liveTs = `export class ContextLiveComponent {
  readonly total = 32_000;

  inputTokens = 2_400;
  outputTokens = 900;

  // Tokens consumed so far — the prompt plus everything the model produced.
  get used(): number {
    return this.inputTokens + this.outputTokens;
  }

  send(): void {
    this.inputTokens += 2_600;
    this.outputTokens += 1_400;
  }
}`;

  contextProps: PropEntry[] = [
    { name: 'used', type: 'number', default: '0', description: 'Tokens consumed so far.' },
    { name: 'total', type: 'number', default: '0', description: 'Size of the context window in tokens. A total of 0 reads as 0% used.' },
    { name: 'inputTokens', type: 'number | null', default: 'null', description: 'Tokens spent on the prompt. Shown in the hover breakdown; omit to hide the row.' },
    { name: 'outputTokens', type: 'number | null', default: 'null', description: 'Tokens produced by the model. Shown in the hover breakdown; omit to hide the row.' },
    { name: 'cost', type: 'number | null', default: 'null', description: 'Spend for this context. Shown in the hover breakdown; omit to hide the row.' },
    { name: 'warningThreshold', type: 'number', default: '0.75', description: 'Ratio at or above which the indicator turns warning-coloured.' },
    { name: 'criticalThreshold', type: 'number', default: '0.9', description: 'Ratio at or above which the indicator turns destructive-coloured.' },
    { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Side of the indicator the breakdown opens on.' },
    { name: 'openDelay', type: 'number', default: '150', description: 'Milliseconds to wait before opening the breakdown.' },
    { name: 'closeDelay', type: 'number', default: '200', description: 'Milliseconds to wait before closing the breakdown.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the indicator (last-wins).' }
  ];

  triggerProps: PropEntry[] = [
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the trigger (last-wins).' }
  ];

  contentProps: PropEntry[] = [
    { name: 'currency', type: 'string', default: "'$'", description: 'Symbol prefixed to the cost figure.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the breakdown (last-wins).' }
  ];
}
