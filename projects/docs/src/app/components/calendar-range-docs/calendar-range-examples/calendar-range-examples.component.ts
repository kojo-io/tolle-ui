import { Component, inject } from '@angular/core';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicRangeCalendarComponent } from '../../../docs-examples/calendar-range/basic-range-calendar.component';

@Component({
  selector: 'app-calendar-range-examples',
  standalone: true,
  imports: [
    ComponentPreviewComponent,
    BasicRangeCalendarComponent
  ],
  template: `
    <section class="mb-16" id="examples">
      <h2 class="mb-6 scroll-m-20 text-xl font-semibold tracking-tight">Examples</h2>

      <div class="space-y-12">
        <div class="space-y-3" id="basic">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Basic Range</h3>
          <p class="text-muted-foreground">Select a start and end date to define a range.</p>
          <app-preview [code]="basicCode" language="typescript">
            <app-basic-range-calendar />
          </app-preview>
        </div>
      </div>
    </section>
  `
})
export class CalendarRangeExamplesComponent {
  sourceService = inject(SourceCodeService);

  basicCode = '';

  constructor() {
    this.sourceService.getFile('calendar-range/basic-range-calendar.component.ts').subscribe(code => this.basicCode = code);
  }
}
