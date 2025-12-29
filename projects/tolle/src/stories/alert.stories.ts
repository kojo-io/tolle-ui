import type { Meta, StoryObj } from '@storybook/angular';
import {AlertComponent} from '../lib/alert.component';

const meta: Meta<AlertComponent> = {
  title: 'UI/Alert',
  component: AlertComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning'],
      description: 'The visual style indicating the nature of the alert',
    },
    title: {
      control: 'text',
      description: 'Optional bold heading for the alert',
    },
    dismissible: {
      control: 'boolean',
      description: 'Shows a close icon and allows the user to hide the alert',
    },
  },
  args: {
    variant: 'default',
    title: 'Heads up!',
    dismissible: false,
  },
};

export default meta;
type Story = StoryObj<AlertComponent>;

// 1. Default Informational Alert
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tolle-alert [variant]="variant" [title]="title" [dismissible]="dismissible">
        <i icon class="ri-information-line"></i>
        You can add components to your app using the CLI.
      </tolle-alert>
    `,
  }),
};

// 2. All Variants Overview
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <tolle-alert title="Default">
          <i icon class="ri-information-line"></i>
          This is a standard informational message.
        </tolle-alert>

        <tolle-alert variant="success" title="Success">
          <i icon class="ri-checkbox-circle-line"></i>
          Your changes have been saved successfully.
        </tolle-alert>

        <tolle-alert variant="warning" title="Warning">
          <i icon class="ri-alert-line"></i>
          Your subscription will expire in 3 days.
        </tolle-alert>

        <tolle-alert variant="destructive" title="Error">
          <i icon class="ri-error-warning-line"></i>
          Something went wrong. Please try again later.
        </tolle-alert>
      </div>
    `,
  }),
};

// 3. Dismissible Alert
export const Dismissible: Story = {
  args: {
    dismissible: true,
    variant: 'warning',
    title: 'System Maintenance',
  },
  render: (args) => ({
    props: args,
    template: `
      <tolle-alert [variant]="variant" [title]="title" [dismissible]="dismissible">
        <i icon class="ri-time-line"></i>
        The server will be down for 5 minutes at midnight tonight.
      </tolle-alert>
    `,
  }),
};
