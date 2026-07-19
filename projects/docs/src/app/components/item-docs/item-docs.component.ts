import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicItemComponent } from '../../docs-examples/item/basic-item/basic-item.component';
import { ItemVariantsComponent } from '../../docs-examples/item/item-variants/item-variants.component';
import { ItemGroupExampleComponent } from '../../docs-examples/item/item-group/item-group.component';


@Component({
  selector: 'app-item-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicItemComponent,
    ItemVariantsComponent,
    ItemGroupExampleComponent
  ],
  templateUrl: './item-docs.component.html',
  styleUrl: './item-docs.component.css'
})
export class ItemDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  ItemComponent,
  ItemGroupComponent,
  ItemMediaComponent,
  ItemContentComponent,
  ItemTitleComponent,
  ItemDescriptionComponent,
  ItemActionsComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [ItemComponent, ItemMediaComponent, ItemContentComponent]
})`;

  basicCode = `<tolle-item variant="outline">
  <tolle-item-media>
    <i class="ri-user-3-line text-xl"></i>
  </tolle-item-media>

  <tolle-item-content>
    <tolle-item-title>Ada Lovelace</tolle-item-title>
    <tolle-item-description>ada@example.com</tolle-item-description>
  </tolle-item-content>

  <tolle-item-actions>
    <tolle-button variant="outline" size="sm">Invite</tolle-button>
  </tolle-item-actions>
</tolle-item>`;

  variantsCode = `<tolle-item variant="default"> ... </tolle-item>
<tolle-item variant="outline"> ... </tolle-item>
<tolle-item variant="muted"> ... </tolle-item>`;

  groupCode = `<tolle-item-group>
  @for (notification of notifications; track notification.title) {
    <tolle-item size="sm">
      <tolle-item-media>
        <i [class]="notification.icon"></i>
      </tolle-item-media>

      <tolle-item-content>
        <tolle-item-title>{{ notification.title }}</tolle-item-title>
        <tolle-item-description>{{ notification.description }}</tolle-item-description>
      </tolle-item-content>

      <tolle-item-actions>
        <tolle-badge variant="secondary" size="xs">{{ notification.status }}</tolle-badge>
      </tolle-item-actions>
    </tolle-item>
  }
</tolle-item-group>`;

  itemProps: PropEntry[] = [
    { name: 'variant', type: "'default' | 'outline' | 'muted'", default: "'default'", description: 'Visual style of the row.' },
    { name: 'size', type: "'xs' | 'sm' | 'default'", default: "'default'", description: 'Padding and gap density of the row.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the row.' }
  ];

  subComponents: PropEntry[] = [
    { name: 'tolle-item-group', type: 'component', description: 'Stacks several rows as a single list (role="list").' },
    { name: 'tolle-item-media', type: 'component', description: 'Leading media slot — avatar, icon, or thumbnail.' },
    { name: 'tolle-item-content', type: 'component', description: 'Grows to fill the row; wraps the title and description.' },
    { name: 'tolle-item-title', type: 'component', description: 'Primary line of the row.' },
    { name: 'tolle-item-description', type: 'component', description: 'Secondary line of the row.' },
    { name: 'tolle-item-actions', type: 'component', description: 'Trailing slot for buttons, switches, or badges.' },
    { name: 'tolle-item-header', type: 'component', description: "Optional full-width header above the row's main line." },
    { name: 'tolle-item-footer', type: 'component', description: "Optional full-width footer below the row's main line." }
  ];
}
