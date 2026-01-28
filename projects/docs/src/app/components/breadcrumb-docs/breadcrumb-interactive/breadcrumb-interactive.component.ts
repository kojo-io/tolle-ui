import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../../../../../tolle/src/lib/breadcrumb.component';
import { BreadcrumbItemComponent } from '../../../../../../tolle/src/lib/breadcrumb-item.component';
import { BreadcrumbLinkComponent } from '../../../../../../tolle/src/lib/breadcrumb-link.component';
import { BreadcrumbSeparatorComponent } from '../../../../../../tolle/src/lib/breadcrumb-separator.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';

@Component({
    selector: 'app-breadcrumb-interactive',
    imports: [
    FormsModule,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent,
    PlaygroundComponent,
    InputComponent,
    CheckboxComponent
],
    templateUrl: './breadcrumb-interactive.component.html'
})
export class BreadcrumbInteractiveComponent {
  label: string = 'Current Page';
  isActive: boolean = true;

  get playgroundCode() {
    return `<tolle-breadcrumb>
  <tolle-breadcrumb-item>
    <tolle-breadcrumb-link>Home</tolle-breadcrumb-link>
  </tolle-breadcrumb-item>
  <tolle-breadcrumb-separator></tolle-breadcrumb-separator>
  <tolle-breadcrumb-item>
    <tolle-breadcrumb-link [active]="${this.isActive}">
      ${this.label}
    </tolle-breadcrumb-link>
  </tolle-breadcrumb-item>
</tolle-breadcrumb>`;
  }
}
