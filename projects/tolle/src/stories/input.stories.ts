import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import {InputComponent} from '../lib/input.component';

const meta: Meta<InputComponent> = {
  title: 'Components/Input',
  component: InputComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [FormsModule, InputComponent],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg'],
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel'],
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    error: { control: 'boolean' },
  },
  args: {
    label: 'Label',
    placeholder: 'Type something...',
    size: 'default',
    type: 'text',
    hint: '',
    errorMessage: '',
    disabled: false,
    readonly: false,
    error: false,
  },
};

export default meta;
type Story = StoryObj<InputComponent>;

// --- Stories ---

export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    label: 'Price',
    placeholder: '0.00',
    type: 'number',
  },
  render: (args) => ({
    props: args,
    template: `
      <tolle-input v-bind="args" [label]="label" [placeholder]="placeholder" [type]="type">
        <span prefix class="text-sm font-medium opacity-50">$</span>
        <span suffix class="text-xs font-bold opacity-50">USD</span>
      </tolle-input>
    `,
  }),
};

export const SearchWithIcon: Story = {
  args: {
    size: 'sm',
    placeholder: 'Search documentation...',
  },
  render: (args) => ({
    props: args,
    template: `
      <tolle-input [size]="size" [placeholder]="placeholder">
        <i prefix class="ri-search-line ml-1"></i>
      </tolle-input>
    `,
  }),
};

export const PasswordError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    error: true,
    errorMessage: 'Password must be at least 8 characters.',
    placeholder: '••••••••',
  },
  render: (args) => ({
    props: args,
    template: `
      <tolle-input
        [label]="label"
        [type]="type"
        [error]="error"
        [errorMessage]="errorMessage"
        [placeholder]="placeholder">
        <i suffix class="ri-lock-line"></i>
      </tolle-input>
    `,
  }),
};

export const Readonly: Story = {
  args: {
    label: 'API Key',
    readonly: true,
    value: 'pk_test_51MzByvL9z...',
    hint: 'This key is generated once and cannot be edited.',
  },
  render: (args) => ({
    props: args,
    template: `
      <tolle-input
        [label]="label"
        [readonly]="readonly"
        [hint]="hint"
        [(ngModel)]="value">
        <i prefix class="ri-key-2-line"></i>
      </tolle-input>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    label: 'Subscription Status',
    disabled: true,
    placeholder: 'Inactive',
  },
};
