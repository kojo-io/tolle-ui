import { Component } from '@angular/core';

@Component({
    selector: 'app-calendar-overview',
    standalone: true,
    template: `
    <section class="mb-16" id="overview">
      <h1 class="text-4xl font-extrabold tracking-tight mb-4">Calendar</h1>
      <p class="text-lg text-muted-foreground mb-8">
        A versatile component that allows users to view and select dates, supporting various modes like date, month, and year selection.
      </p>

      <div class="mt-12" id="installation">
        <h2 class="text-2xl font-bold mb-4">Installation</h2>
        <div class="rounded-xl bg-neutral-900 border border-neutral-800 p-4">
          <code class="text-sm text-neutral-300">import {{ '{' }} CalendarComponent {{ '}' }} from '&#64;tolle-ui';</code>
        </div>
      </div>
    </section>
  `
})
export class CalendarOverviewComponent { }
