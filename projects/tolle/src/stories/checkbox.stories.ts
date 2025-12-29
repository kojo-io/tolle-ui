import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CheckboxComponent} from '../lib/checkbox.component';

const meta: Meta<CheckboxComponent> = {
  title: 'UI/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, CheckboxComponent],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg'],
      description: 'The dimensions of the checkbox square',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and reduces opacity',
    },
  },
  args: {
    size: 'default',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

// 1. Basic Interactive Checkbox
export const Default: Story = {};

// 2. Form Example (Label + Description)
export const WithLabel: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex items-start gap-3 p-4">
        <tolle-checkbox [size]="size" [disabled]="disabled"></tolle-checkbox>
        <div class="grid gap-1.5 leading-none">
          <label class="text-sm font-medium leading-none">
            Accept terms and conditions
          </label>
          <p class="text-xs text-muted-foreground">
            You agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    `,
  }),
};

// 3. Size Comparison
export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-col gap-6 p-4">
        <div class="flex items-center gap-2">
          <tolle-checkbox size="xs"></tolle-checkbox>
          <span class="text-xs">Extra Small (xs)</span>
        </div>
        <div class="flex items-center gap-2">
          <tolle-checkbox size="sm"></tolle-checkbox>
          <span class="text-sm">Small (sm)</span>
        </div>
        <div class="flex items-center gap-2">
          <tolle-checkbox size="default"></tolle-checkbox>
          <span class="text-sm font-medium">Default</span>
        </div>
        <div class="flex items-center gap-2">
          <tolle-checkbox size="lg"></tolle-checkbox>
          <span class="text-base font-bold">Large (lg)</span>
        </div>
      </div>
    `,
  }),
};

// 4. Disabled States
export const States: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-col gap-4 p-4">
        <div class="flex items-center gap-2">
          <tolle-checkbox [disabled]="true"></tolle-checkbox>
          <span class="text-sm opacity-50">Disabled Off</span>
        </div>
        <div class="flex items-center gap-2">
          <tolle-checkbox [disabled]="true" [ngModel]="true"></tolle-checkbox>
          <span class="text-sm opacity-50">Disabled On</span>
        </div>
      </div>
    `,
  }),
};
