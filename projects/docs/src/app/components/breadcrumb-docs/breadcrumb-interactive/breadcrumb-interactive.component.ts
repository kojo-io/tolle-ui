import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent,
    PlaygroundComponent,
    InputComponent,
    CheckboxComponent
  ],
  template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <tolle-breadcrumb>
            <tolle-breadcrumb-item>
              <tolle-breadcrumb-link>Home</tolle-breadcrumb-link>
            </tolle-breadcrumb-item>
            <tolle-breadcrumb-separator></tolle-breadcrumb-separator>
            <tolle-breadcrumb-item>
              <tolle-breadcrumb-link [active]="isActive">
                {{ label }}
              </tolle-breadcrumb-link>
            </tolle-breadcrumb-item>
          </tolle-breadcrumb>
        </div>

        <div controls class="space-y-4">
          <div class="space-y-2">
            <tolle-input label="Label" [(ngModel)]="label" size="sm"></tolle-input>
          </div>
          <div class="flex items-center gap-2 py-2">
            <tolle-checkbox [(ngModel)]="isActive" size="sm"></tolle-checkbox>
            <label class="text-sm font-medium">Active (Current Page)</label>
          </div>
        </div>
      </app-playground>
    </section>
  `
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
