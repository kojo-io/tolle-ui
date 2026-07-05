import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
    selector: 'app-check-box-overview',
    standalone: true,
    imports: [BaseEditorComponent, DocHeroComponent],
    templateUrl: './check-box-overview.component.html'
})
export class CheckBoxOverviewComponent {
    installation = `import { CheckBoxComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [CheckBoxComponent]
})`;
}
