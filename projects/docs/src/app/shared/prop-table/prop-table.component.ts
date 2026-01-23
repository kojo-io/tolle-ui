import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropEntry } from '../types';

@Component({
    selector: 'app-prop-table',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 my-6">
      <table class="w-full text-left text-sm">
        <thead class="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <tr>
            <th class="px-6 py-3 font-semibold">Name</th>
            <th class="px-6 py-3 font-semibold">Type</th>
            <th class="px-6 py-3 font-semibold">Default</th>
            <th class="px-6 py-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-transparent">
          @for (prop of props; track prop.name) {
            <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
              <td class="px-6 py-4 font-mono font-medium text-primary">
                {{ prop.name }}
              </td>
              <td class="px-6 py-4">
                <code class="text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-foreground">
                  {{ prop.type }}
                </code>
              </td>
              <td class="px-6 py-4 font-mono text-xs text-muted-foreground">
                {{ prop.default || '-' }}
              </td>
              <td class="px-6 py-4 text-muted-foreground">
                {{ prop.description }}
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" class="px-6 py-8 text-center text-muted-foreground">
                No properties defined.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class PropTableComponent {
    @Input({ required: true }) props: PropEntry[] = [];
}
