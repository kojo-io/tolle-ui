import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata, applicationConfig } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DatePickerComponent } from '../lib/date-picker.component';

// 1. Wrapper Component for Form State
@Component({
  selector: 'date-picker-story-wrapper',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerComponent],
  template: `
    <div class="p-10 w-full h-screen flex flex-col justify-content-center items-center">
      <div class="w-full max-w-xs space-y-4">
        <div>
          <label class="text-sm font-medium text-foreground">Pick a Date</label>
          <p class="mb-2 text-xs text-muted-foreground">Manual entry or calendar selection</p>
        </div>

        <tolle-date-picker
          [formControl]="dateControl"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [disablePastDates]="disablePastDates"></tolle-date-picker>

        <div class="bg-muted/30 mt-8 rounded-lg border border-dashed p-4">
          <p class="font-mono text-xs">
            <strong>FormControl Value:</strong><br />
            {{ dateControl.value ? (dateControl.value | date: 'fullDate') : 'null' }}
          </p>
        </div>
      </div>
    </div>
  `,
})
class DatePickerWrapperComponent {
  dateControl = new FormControl<Date | null>(null);

  @Input() placeholder = 'MM/DD/YYYY';
  @Input() disabled = false;
  @Input() disablePastDates = false;
}

// 2. Metadata Configuration
const meta: Meta<DatePickerComponent> = {
  title: 'Components/Date Picker',
  component: DatePickerComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [DatePickerWrapperComponent, CommonModule, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    disablePastDates: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<DatePickerComponent>;

// --- Stories ---

export const Interactive: Story = {
  args: {
    placeholder: 'Select a date...',
    disabled: false,
    disablePastDates: false,
  },
  render: args => ({
    props: args,
    template: `
      <date-picker-story-wrapper
        [placeholder]="placeholder"
        [disabled]="disabled"
        [disablePastDates]="disablePastDates">
      </date-picker-story-wrapper>
    `,
  }),
};

export const DisabledState: Story = {
  args: {
    disabled: true,
    placeholder: 'Cannot select date',
  },
  render: args => ({
    props: args,
    template: `
      <div class="p-10 w-full">
        <tolle-date-picker [disabled]="disabled" [placeholder]="placeholder"></tolle-date-picker>
      </div>
    `,
  }),
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Birthday (MM/DD/YYYY)',
    disabled: true,
  },
  render: args => ({
    props: args,
    template: `
       <div class="p-10 w-full h-screen flex flex-col justify-content-center items-center">
        <tolle-date-picker [placeholder]="placeholder"></tolle-date-picker>
      </div>
    `,
  }),
};
