import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicBadgeComponent } from '../../../docs-examples/badge/basic-badge/basic-badge.component';
import { BadgeSizesComponent } from '../../../docs-examples/badge/badge-sizes/badge-sizes.component';
import { BadgeRemovableComponent } from '../../../docs-examples/badge/badge-removable/badge-removable.component';
import { BadgeWithIconsComponent } from '../../../docs-examples/badge/badge-with-icons/badge-with-icons.component';

@Component({
    selector: 'app-badge-examples',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SegmentedComponent,
        BaseEditorComponent,
        BasicBadgeComponent,
        BadgeSizesComponent,
        BadgeRemovableComponent,
        BadgeWithIconsComponent
    ],
    templateUrl: './badge-examples.component.html'
})
export class BadgeExamplesComponent {
    basicTab = 'preview';
    sizesTab = 'preview';
    removableTab = 'preview';
    iconsTab = 'preview';

    viewOptions = [
        { label: 'Preview', value: 'preview' },
        { label: 'Code', value: 'code' }
    ];

    basicCode = `<tolle-badge>Active</tolle-badge>
<tolle-badge variant="secondary">Draft</tolle-badge>
<tolle-badge variant="outline">Archived</tolle-badge>
<tolle-badge variant="destructive">Error</tolle-badge>`;

    sizesCode = `<tolle-badge size="xs">XS Tag</tolle-badge>
<tolle-badge size="sm">SM Tag</tolle-badge>
<tolle-badge size="default">Default Tag</tolle-badge>`;

    removableCode = `<tolle-badge [removable]="true" (onRemove)="remove(id)">
  Design
</tolle-badge>`;

    iconsCode = `<tolle-badge variant="secondary">
  <i prefix class="ri-price-tag-3-line"></i>
  Ecommerce
</tolle-badge>`;
}
