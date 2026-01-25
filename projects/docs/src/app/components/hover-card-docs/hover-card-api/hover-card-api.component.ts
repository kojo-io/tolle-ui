import { Component } from '@angular/core';

@Component({
    selector: 'app-hover-card-api',
    standalone: true,
    template: `
    <section class="mb-16" id="api-reference">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>
      
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-foreground">HoverCard</h3>
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
                  <td class="py-3 px-4 font-mono text-primary">openDelay</td>
                  <td class="py-3 px-4">number</td>
                  <td class="py-3 px-4">700</td>
                  <td class="py-3 px-4">The duration from when the mouse enters the trigger until the card opens.</td>
                </tr>
                <tr class="border-b border-border">
                  <td class="py-3 px-4 font-mono text-primary">closeDelay</td>
                  <td class="py-3 px-4">number</td>
                  <td class="py-3 px-4">300</td>
                  <td class="py-3 px-4">The duration from when the mouse leaves the trigger or content until the card closes.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-foreground">HoverCardContent</h3>
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
                  <td class="py-3 px-4 font-mono text-primary">class</td>
                  <td class="py-3 px-4">string</td>
                  <td class="py-3 px-4">""</td>
                  <td class="py-3 px-4">Additional CSS classes to apply to the content container.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HoverCardApiComponent { }
