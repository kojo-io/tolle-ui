import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
    selector: 'app-badge-overview',
    imports: [BaseEditorComponent],
    templateUrl: './badge-overview.component.html'
})
export class BadgeOverviewComponent {
    installation = `import { BadgeComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [BadgeComponent]
})`;
}
