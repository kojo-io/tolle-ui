import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
    selector: 'app-avatar-overview',
    standalone: true,
    imports: [BaseEditorComponent],
    templateUrl: './avatar-overview.component.html'
})
export class AvatarOverviewComponent {
    installation = `import { AvatarComponent, AvatarFallbackComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [AvatarComponent, AvatarFallbackComponent]
})`;
}
