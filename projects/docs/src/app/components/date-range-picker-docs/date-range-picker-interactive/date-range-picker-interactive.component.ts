import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateRangePickerComponent } from '../../../../../../tolle/src/lib/date-range-picker.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';
import { DateRange } from '../../../../../../tolle/src/lib/types/date-range';

@Component({
    selector: 'app-date-range-picker-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DateRangePickerComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent,
        SwitchComponent,
        InputComponent,
        LabelComponent
    ],
    template: `
    <section class="space-y-6">
      <h2 class="text-xl font-semibold tracking-tight text-foreground">Interactive Playground</h2>
      
      <app-playground [code]="codeSnippet">
        <div preview class="flex items-center justify-center min-h-[400px] w-full">
          <div class="max-w-md w-full">
            <tolle-date-range-picker 
              [placeholder]="placeholder" 
              [disabled]="disabled"
              [disablePastDates]="disablePastDates"
              [size]="size"
              [(ngModel)]="range"
            ></tolle-date-range-picker>
          </div>
        </div>

        <div controls class="space-y-5">
          <div class="space-y-1.5">
            <tolle-label>Placeholder</tolle-label>
            <tolle-input [(ngModel)]="placeholder" size="sm" placeholder="Select a range" />
          </div>

          <label class="flex items-center justify-between text-sm font-medium">
            <span>Disabled</span>
            <tolle-switch [(ngModel)]="disabled" size="sm" />
          </label>

          <label class="flex items-center justify-between text-sm font-medium">
            <span>Disable Past Dates</span>
            <tolle-switch [(ngModel)]="disablePastDates" size="sm" />
          </label>

          <div class="space-y-1.5">
            <tolle-label>Size</tolle-label>
            <tolle-select [(ngModel)]="size" size="sm">
              <tolle-select-item value="xs">Extra Small</tolle-select-item>
              <tolle-select-item value="sm">Small</tolle-select-item>
              <tolle-select-item value="default">Default</tolle-select-item>
              <tolle-select-item value="lg">Large</tolle-select-item>
            </tolle-select>
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class DateRangePickerInteractiveComponent {
    range: DateRange = { start: null, end: null };
    placeholder = 'Select a range';
    disabled = false;
    disablePastDates = false;
    size: 'xs' | 'sm' | 'default' | 'lg' = 'default';

    get codeSnippet(): string {
        const disabledAttr = this.disabled ? ' [disabled]="true"' : '';
        const pastAttr = this.disablePastDates ? ' [disablePastDates]="true"' : '';

        return `<tolle-date-range-picker 
  placeholder="${this.placeholder}" 
  size="${this.size}"${disabledAttr}${pastAttr}
  [(ngModel)]="range"
></tolle-date-range-picker>`;
    }
}
