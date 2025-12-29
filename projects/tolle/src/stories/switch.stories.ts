import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SwitchComponent} from '../lib/switch.component';

const meta: Meta<SwitchComponent> = {
  title: 'UI/Switch',
  component: SwitchComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, SwitchComponent],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg'],
      description: 'The size of the switch track and thumb',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies opacity',
    },
  },
  args: {
    size: 'default',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<SwitchComponent>;

// 1. Interactive Playground
export const Playground: Story = {
  args: {
    size: 'default',
  },
};

// 2. All Sizes Comparison
export const AllSizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-2">
          <tolle-switch size="xs"></tolle-switch>
          <span class="text-[10px] font-medium uppercase text-muted-foreground">Extra Small (xs)</span>
        </div>

        <div class="flex items-center gap-3">
          <tolle-switch size="sm"></tolle-switch>
          <span class="text-xs">Small (sm)</span>
        </div>

        <div class="flex items-center gap-3">
          <tolle-switch size="default"></tolle-switch>
          <span class="text-sm font-medium">Default</span>
        </div>

        <div class="flex items-center gap-4">
          <tolle-switch size="lg"></tolle-switch>
          <span class="text-base font-semibold">Large (lg)</span>
        </div>
      </div>
    `,
  }),
};

// 3. Setting Row Pattern (Best Practice)
export const SettingRow: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full max-w-sm rounded-lg border p-4 shadow-sm bg-card">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Marketing Emails
            </label>
            <p class="text-xs text-muted-foreground">
              Receive emails about new products and features.
            </p>
          </div>
          <tolle-switch size="default"></tolle-switch>
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
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <tolle-switch [disabled]="true"></tolle-switch>
          <span class="text-sm">Disabled Off</span>
        </div>
        <div class="flex items-center gap-2">
          <tolle-switch [disabled]="true" [ngModel]="true"></tolle-switch>
          <span class="text-sm">Disabled On</span>
        </div>
      </div>
    `,
  }),
};
