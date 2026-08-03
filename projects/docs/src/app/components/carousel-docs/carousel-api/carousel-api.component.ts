import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel-api',
  imports: [],
  template: `
    <div class="space-y-8">
      <div>
        <h2 class="mb-4 text-lg font-bold">API Reference</h2>
        <div class="space-y-4">
          <div class="overflow-hidden rounded-lg border">
            <table class="w-full text-left text-sm">
              <thead class="border-b bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th class="px-4 py-2 font-medium">Input</th>
                  <th class="px-4 py-2 font-medium">Type</th>
                  <th class="px-4 py-2 font-medium">Default</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr>
                  <td class="px-4 py-2">opt</td>
                  <td class="px-4 py-2"><code>EmblaOptionsType</code></td>
                  <td class="px-4 py-2">
                    <code>{{ '{ }' }}</code>
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2">plugins</td>
                  <td class="px-4 py-2"><code>EmblaPluginType[]</code></td>
                  <td class="px-4 py-2"><code>[]</code></td>
                </tr>
                <tr>
                  <td class="px-4 py-2">orientation</td>
                  <td class="px-4 py-2"><code>'horizontal' | 'vertical'</code></td>
                  <td class="px-4 py-2"><code>'horizontal'</code></td>
                </tr>
                <tr>
                  <td class="px-4 py-2">api</td>
                  <td class="px-4 py-2"><code>EventEmitter&lt;EmblaCarouselType&gt;</code></td>
                  <td class="px-4 py-2">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <h2 class="mb-4 text-lg font-bold">Directives</h2>
        <div class="overflow-hidden rounded-lg border">
          <table class="w-full text-left text-sm">
            <thead class="border-b bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th class="px-4 py-2 font-medium">Directive</th>
                <th class="px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr>
                <td class="px-4 py-2"><code>tolleCarouselContent</code></td>
                <td class="px-4 py-2">The viewport element (embla__viewport).</td>
              </tr>
              <tr>
                <td class="px-4 py-2"><code>tolleCarouselContainer</code></td>
                <td class="px-4 py-2">The scroll container (embla__container).</td>
              </tr>
              <tr>
                <td class="px-4 py-2"><code>tolleCarouselItem</code></td>
                <td class="px-4 py-2">A single slide (embla__slide).</td>
              </tr>
              <tr>
                <td class="px-4 py-2"><code>tolleCarouselPrevious</code></td>
                <td class="px-4 py-2">Previous button trigger.</td>
              </tr>
              <tr>
                <td class="px-4 py-2"><code>tolleCarouselNext</code></td>
                <td class="px-4 py-2">Next button trigger.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class CarouselApiComponent {}
