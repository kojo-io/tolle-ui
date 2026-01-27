import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicAvatarComponent } from '../../../docs-examples/avatar/basic-avatar/basic-avatar.component';
import { AvatarSizesComponent } from '../../../docs-examples/avatar/avatar-sizes/avatar-sizes.component';
import { AvatarShapesComponent } from '../../../docs-examples/avatar/avatar-shapes/avatar-shapes.component';
import { AvatarFallbackExampleComponent } from '../../../docs-examples/avatar/avatar-fallback-example/avatar-fallback-example.component';

@Component({
    selector: 'app-avatar-examples',
    imports: [
        CommonModule,
        FormsModule,
        SegmentedComponent,
        BaseEditorComponent,
        BasicAvatarComponent,
        AvatarSizesComponent,
        AvatarShapesComponent,
        AvatarFallbackExampleComponent
    ],
    templateUrl: './avatar-examples.component.html'
})
export class AvatarExamplesComponent {
    basicTab = 'preview';
    sizesTab = 'preview';
    shapesTab = 'preview';
    fallbackTab = 'preview';

    viewOptions = [
        { label: 'Preview', value: 'preview' },
        { label: 'Code', value: 'code' }
    ];

    basicCode = `<tolle-avatar src="https://github.com/nutlope.png">
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>`;

    sizesCode = `<tolle-avatar size="sm" src="...">...</tolle-avatar>
<tolle-avatar size="default" src="...">...</tolle-avatar>
<tolle-avatar size="lg" src="...">...</tolle-avatar>
<tolle-avatar size="xl" src="...">...</tolle-avatar>`;

    shapesCode = `<tolle-avatar shape="circle" src="...">...</tolle-avatar>
<tolle-avatar shape="square" src="...">...</tolle-avatar>`;

    fallbackCode = `<tolle-avatar src="invalid.png">
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>

<tolle-avatar>
  <tolle-avatar-fallback>
    <i class="ri-user-line"></i>
  </tolle-avatar-fallback>
</tolle-avatar>`;
}
