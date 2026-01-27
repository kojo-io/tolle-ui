import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {Component, Input} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {CalendarComponent} from '../lib/calendar.component';

// 1. Wrapper for Form Integration
// This allows us to see the value update in real-time
@Component({
    selector: 'calendar-story-wrapper',
    imports: [CommonModule, ReactiveFormsModule, CalendarComponent],
    template: `
    <div class="p-10 flex flex-col gap-6 items-start max-w-md border rounded-xl bg-card">
      <div>
        <h2 class="text-lg font-semibold">Schedule Meeting</h2>
        <p class="text-sm text-muted-foreground">Pick a date for your consultation.</p>
      </div>

      <tolle-calendar
        [formControl]="dateControl"
        [disablePastDates]="disablePastDates"
      ></tolle-calendar>

      <div class="p-3 bg-muted rounded text-sm w-full">
        <span class="font-medium">Selected Date:</span>
        {{ dateControl.value | date:'fullDate' }}
      </div>
    </div>
  `
})
class CalendarWrapperComponent {
  // Initialize with today's date
  dateControl = new FormControl(new Date());
  @Input() disablePastDates = false;
}

// 2. Story Metadata
const meta: Meta<CalendarComponent> = {
  title: 'Components/Calendar',
  component: CalendarComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule, CalendarWrapperComponent],
    }),
  ],
  argTypes: {
    disablePastDates: {
      control: 'boolean',
      description: 'If true, prevents selecting dates before today',
    },
  },
};

export default meta;
type Story = StoryObj<CalendarComponent>;

// --- Stories ---

// 1. Basic Component (No wrapper, just the element)
export const Default: Story = {
  args: {
    disablePastDates: false,
  },
};

// 2. Disabled Past Dates
export const FutureDatesOnly: Story = {
  args: {
    disablePastDates: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sets `disablePastDates=true`. Try navigating to previous months; past days will be grayed out and unclickable.',
      }
    }
  }
};

// 3. The Fix: Use 'template' instead of 'component'
export const WithForm: Story = {
  render: (args) => ({
    props: args, // Passes story args (like disablePastDates) to the wrapper
    template: `<calendar-story-wrapper [disablePastDates]="disablePastDates"></calendar-story-wrapper>`,
  }),
};
