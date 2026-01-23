import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
  selector: 'app-breadcrumb-api',
  standalone: true,
  imports: [PropTableComponent],
  template: `
    <section class="mb-16" id="api">
      <h2 class="text-3xl font-bold mb-6 text-foreground">API Reference</h2>

      <div class="space-y-12">
        <div id="breadcrumb-api">
          <h3 class="text-xl font-semibold mb-4 text-foreground">Breadcrumb</h3>
          <app-prop-table [props]="breadcrumbProps" />
        </div>

        <div id="breadcrumb-link-api">
          <h3 class="text-xl font-semibold mb-4 text-foreground">Breadcrumb Link</h3>
          <app-prop-table [props]="linkProps" />
        </div>
      </div>
    </section>
  `
})
export class BreadcrumbApiComponent {
  breadcrumbProps: PropEntry[] = [
    { name: 'class', type: 'string', description: 'Additional CSS classes for the nav container.' }
  ];

  linkProps: PropEntry[] = [
    { name: 'active', type: 'boolean', default: 'false', description: 'Whether the link is the current page (disables clicking).' }
  ];
}
