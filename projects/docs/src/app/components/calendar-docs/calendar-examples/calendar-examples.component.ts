import { Component, inject } from '@angular/core';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicCalendarComponent } from '../../../docs-examples/calendar/basic-calendar.component';
import { ModeCalendarComponent } from '../../../docs-examples/calendar/mode-calendar.component';
import { DisabledCalendarComponent } from '../../../docs-examples/calendar/disabled-calendar.component';

@Component({
  selector: 'app-calendar-examples',
  standalone: true,
  imports: [
    ComponentPreviewComponent,
    BasicCalendarComponent,
    ModeCalendarComponent,
    DisabledCalendarComponent
  ],
  template: `
    <section class="mb-16" id="examples">
      <h2 class="mb-6 scroll-m-20 text-xl font-semibold tracking-tight">Examples</h2>

      <div class="space-y-12">
        <div class="space-y-3" id="basic">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Basic</h3>
          <p class="text-muted-foreground">The default single-date selection calendar.</p>
          <app-preview [code]="basicCode" language="typescript">
            <app-basic-calendar />
          </app-preview>
        </div>

        <div class="space-y-3" id="modes">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Different Modes</h3>
          <p class="text-muted-foreground">Switch between date, month, and year selection modes.</p>
          <app-preview [code]="modeCode" language="typescript">
            <app-mode-calendar />
          </app-preview>
        </div>

        <div class="space-y-3" id="disabled">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Disabled & Restrictions</h3>
          <p class="text-muted-foreground">Restrict date selection using past date disabling or min/max bounds.</p>
          <app-preview [code]="disabledCode" language="typescript">
            <app-disabled-calendar />
          </app-preview>
        </div>
      </div>
    </section>
  `
})
export class CalendarExamplesComponent {
  sourceService = inject(SourceCodeService);

  basicCode = '';
  modeCode = '';
  disabledCode = '';

  constructor() {
    this.sourceService.getFile('calendar/basic-calendar.component.ts').subscribe(code => this.basicCode = code);
    this.sourceService.getFile('calendar/mode-calendar.component.ts').subscribe(code => this.modeCode = code);
    this.sourceService.getFile('calendar/disabled-calendar.component.ts').subscribe(code => this.disabledCode = code);
  }
}
