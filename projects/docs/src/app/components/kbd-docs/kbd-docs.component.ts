import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicKbdComponent } from '../../docs-examples/kbd/basic-kbd/basic-kbd.component';
import { KbdSizesComponent } from '../../docs-examples/kbd/kbd-sizes/kbd-sizes.component';
import { KbdShortcutComponent } from '../../docs-examples/kbd/kbd-shortcut/kbd-shortcut.component';


@Component({
  selector: 'app-kbd-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicKbdComponent,
    KbdSizesComponent,
    KbdShortcutComponent
  ],
  templateUrl: './kbd-docs.component.html',
  styleUrl: './kbd-docs.component.css'
})
export class KbdDocsComponent {
  baseService = inject(BaseService);

  installation = `import { KbdComponent, KbdGroupComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [KbdComponent, KbdGroupComponent]
})`;

  basicCode = `<tolle-kbd>⌘</tolle-kbd>
<tolle-kbd>Shift</tolle-kbd>
<tolle-kbd>Esc</tolle-kbd>
<tolle-kbd variant="outline">Enter</tolle-kbd>`;

  sizesCode = `<tolle-kbd size="sm">⌘</tolle-kbd>
<tolle-kbd size="default">⌘</tolle-kbd>
<tolle-kbd size="lg">⌘</tolle-kbd>`;

  shortcutCode = `<tolle-kbd-group>
  <tolle-kbd>⌘</tolle-kbd>
  <tolle-kbd>K</tolle-kbd>
</tolle-kbd-group>`;

  kbdProps: PropEntry[] = [
    { name: 'size', type: "'sm' | 'default' | 'lg'", default: "'default'", description: 'Size of the key cap.' },
    { name: 'variant', type: "'default' | 'outline'", default: "'default'", description: 'Visual style of the key cap.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the key cap.' }
  ];

  kbdGroupProps: PropEntry[] = [
    { name: 'class', type: 'string', description: 'Additional CSS classes for the group.' }
  ];
}
