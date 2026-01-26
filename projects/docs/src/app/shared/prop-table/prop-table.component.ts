import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropEntry } from '../types';

@Component({
  selector: 'app-prop-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto rounded-lg border border-border mt-6 mb-10">
      <table class="w-full text-left text-sm">
        <thead class="bg-muted/50 border-b border-border">
          <tr>
            <th class="px-6 py-3 font-semibold text-foreground">Name</th>
            <th class="px-6 py-3 font-semibold text-foreground">Type</th>
            <th class="px-6 py-3 font-semibold text-foreground">Default</th>
            <th class="px-6 py-3 font-semibold text-foreground">Description</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border bg-transparent">
          @for (prop of props; track prop.name) {
            <tr class="hover:bg-muted/30 transition-colors">
              <td class="px-6 py-4 font-mono font-medium text-foreground">
                {{ prop.name }}
              </td>
              <td class="px-6 py-4">
                <code class="text-xs bg-muted border border-border px-1.5 py-0.5 rounded text-foreground">
                  {{ prop.type }}
                </code>
              </td>
              <td class="px-6 py-4 font-mono text-xs text-muted-foreground">
                {{ prop.default || '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-muted-foreground leading-relaxed">
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
