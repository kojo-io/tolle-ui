import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropEntry } from '../types';

@Component({
  selector: 'app-prop-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="my-6 overflow-x-auto rounded-lg border border-border">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" class="px-5 py-3 font-semibold">Name</th>
            <th scope="col" class="px-5 py-3 font-semibold">Type</th>
            <th scope="col" class="px-5 py-3 font-semibold">Default</th>
            <th scope="col" class="px-5 py-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          @for (prop of props; track prop.name) {
            <tr class="align-top transition-colors hover:bg-muted/40">
              <td class="whitespace-nowrap px-5 py-3.5 font-mono text-[13px] font-medium text-foreground">
                {{ prop.name }}
              </td>
              <td class="px-5 py-3.5">
                <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary">{{ prop.type }}</code>
              </td>
              <td class="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-muted-foreground">
                {{ prop.default || '—' }}
              </td>
              <td class="px-5 py-3.5 text-muted-foreground">
                {{ prop.description }}
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" class="px-5 py-8 text-center text-muted-foreground">
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
