import { Component } from '@angular/core';

@Component({
    selector: 'app-toggle-group-api',
    standalone: true,
    template: `
    <section class="mb-16" id="api-reference">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>
      
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-foreground">ToggleGroup</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left border-collapse">
              <thead>
                <tr class="border-b border-border">
                  <th class="py-3 px-4 font-semibold text-foreground">Prop</th>
                  <th class="py-3 px-4 font-semibold text-foreground">Type</th>
                  <th class="py-3 px-4 font-semibold text-foreground">Default</th>
                  <th class="py-3 px-4 font-semibold text-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-border">
                  <td class="py-3 px-4 font-mono text-primary">type</td>
                  <td class="py-3 px-4">"single" | "multiple"</td>
                  <td class="py-3 px-4">"single"</td>
                  <td class="py-3 px-4">Determines whether a single or multiple items can be pressed at a time.</td>
                </tr>
                <tr class="border-b border-border">
                  <td class="py-3 px-4 font-mono text-primary">variant</td>
                  <td class="py-3 px-4">"default" | "outline"</td>
                  <td class="py-3 px-4">"default"</td>
                  <td class="py-3 px-4">The visual style of the toggle items.</td>
                </tr>
                <tr class="border-b border-border">
                  <td class="py-3 px-4 font-mono text-primary">size</td>
                  <td class="py-3 px-4">"default" | "sm" | "lg"</td>
                  <td class="py-3 px-4">"default"</td>
                  <td class="py-3 px-4">The size of the toggle items.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-foreground">ToggleGroupItem</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left border-collapse">
              <thead>
                <tr class="border-b border-border">
                  <th class="py-3 px-4 font-semibold text-foreground">Prop</th>
                  <th class="py-3 px-4 font-semibold text-foreground">Type</th>
                  <th class="py-3 px-4 font-semibold text-foreground">Default</th>
                  <th class="py-3 px-4 font-semibold text-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-border">
                  <td class="py-3 px-4 font-mono text-primary">value</td>
                  <td class="py-3 px-4">string</td>
                  <td class="py-3 px-4">-</td>
                  <td class="py-3 px-4">The unique value associated with the item.</td>
                </tr>
                <tr class="border-b border-border">
                  <td class="py-3 px-4 font-mono text-primary">disabled</td>
                  <td class="py-3 px-4">boolean</td>
                  <td class="py-3 px-4">false</td>
                  <td class="py-3 px-4">Whether the item is interactable.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ToggleGroupApiComponent { }
