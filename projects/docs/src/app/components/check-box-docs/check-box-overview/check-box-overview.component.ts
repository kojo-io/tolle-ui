import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
    selector: 'app-check-box-overview',
    standalone: true,
    imports: [BaseEditorComponent],
    templateUrl: './check-box-overview.component.html'
})
export class CheckBoxOverviewComponent {
    installation = `import { CheckBoxComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [CheckBoxComponent]
})`;
}
