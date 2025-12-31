import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import {DateRangePickerComponent} from '../lib/date-range-picker.component';
import {RangeCalendarComponent} from '../lib/range-calendar.component';
import {DateRange} from '../lib/types/date-range';

// 1. Wrapper to visualize the range selection and form integration
@Component({
  selector: 'range-picker-story-wrapper', // <--- This selector must match the template below
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateRangePickerComponent, RangeCalendarComponent],
  template: `
    <div class="p-10 space-y-8 max-w-2xl bg-background border rounded-xl shadow-sm">
      <div class="space-y-1">
        <h3 class="text-lg font-bold">Booking Duration</h3>
        <p class="text-sm text-muted-foreground">Select your check-in and check-out dates.</p>
      </div>

      <div class="w-80">
        <tolle-date-range-picker
          [formControl]="rangeControl"
          [placeholder]="placeholder"
          [disablePastDates]="disablePastDates"
        ></tolle-date-range-picker>
      </div>

      <div class="p-4 bg-muted rounded-lg border border-dashed text-xs font-mono">
        <p><strong>Start:</strong> {{ rangeControl.value?.start | date:'mediumDate' }}</p>
        <p><strong>End:</strong> {{ rangeControl.value?.end | date:'mediumDate' }}</p>
      </div>

      <div class="pt-6 border-t">
        <h4 class="text-sm font-semibold mb-4 text-muted-foreground uppercase">Inline Calendar View</h4>
        <tolle-range-calendar [formControl]="rangeControl"></tolle-range-calendar>
      </div>
    </div>
  `
})
class RangePickerWrapperComponent {
  rangeControl = new FormControl<DateRange>({ start: null, end: null });

  @Input() placeholder = 'Pick dates...';
  @Input() disablePastDates = true;
}

const meta: Meta = {
  title: 'Components/Date Range Picker',
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({ imports: [RangePickerWrapperComponent] }),
  ],
  argTypes: {
    placeholder: { control: 'text' },
    disablePastDates: { control: 'boolean' },
  }
};

export default meta;

export const Default: StoryObj = {
  args: {
    placeholder: 'Select range...',
    disablePastDates: true
  },
  render: (args) => ({
    props: args,
    // FIX: The tag here now matches the selector 'range-picker-story-wrapper'
    template: `<range-picker-story-wrapper
      [placeholder]="placeholder"
      [disablePastDates]="disablePastDates">
    </range-picker-story-wrapper>`,
  }),
};
