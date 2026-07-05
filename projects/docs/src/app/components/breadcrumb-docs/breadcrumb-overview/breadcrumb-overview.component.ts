import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
  selector: 'app-breadcrumb-overview',
  standalone: true,
  imports: [BaseEditorComponent, DocHeroComponent],
  templateUrl: './breadcrumb-overview.component.html'
})
export class BreadcrumbOverviewComponent {
  installationCode = `import { 
  BreadcrumbComponent, 
  BreadcrumbItemComponent, 
  BreadcrumbLinkComponent, 
  BreadcrumbSeparatorComponent 
} from 'tolle-ui';

imports: [
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent
]`;
}
