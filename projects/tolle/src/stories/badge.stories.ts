import type { Meta, StoryObj } from '@storybook/angular';
import {BadgeComponent} from '../lib/badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'Components/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'destructive'],
      description: 'The visual style of the badge',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default'],
      description: 'The vertical and horizontal scaling',
    },
    removable: {
      control: 'boolean',
      description: 'Shows a close icon and enables the onRemove emitter',
    },
  },
  args: {
    variant: 'default',
    size: 'default',
    removable: false,
  },
};

export default meta;
type Story = StoryObj<BadgeComponent>;

// 1. Basic Badge
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tolle-badge [variant]="variant" [size]="size" [removable]="removable">
        Badge
      </tolle-badge>
    `,
  }),
};

// 2. Variants Overview
export const AllVariants: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex gap-2">
        <tolle-badge variant="default">Default</tolle-badge>
        <tolle-badge variant="secondary">Secondary</tolle-badge>
        <tolle-badge variant="outline">Outline</tolle-badge>
        <tolle-badge variant="destructive">Destructive</tolle-badge>
      </div>
    `,
  }),
};

// 3. Removable / Tags
export const Removable: Story = {
  args: {
    removable: true,
    variant: 'secondary',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex gap-2">
        <tolle-badge [removable]="true" variant="secondary">Angular</tolle-badge>
        <tolle-badge [removable]="true" variant="secondary">TypeScript</tolle-badge>
        <tolle-badge [removable]="true" variant="secondary">Tailwind</tolle-badge>
      </div>
    `,
  }),
};

// 4. Badges with Icons (Prefix)
export const WithPrefix: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex gap-2">
        <tolle-badge variant="outline">
          <i prefix class="ri-shield-check-line"></i>
          Verified
        </tolle-badge>
        <tolle-badge variant="default">
          <i prefix class="ri-star-fill"></i>
          Featured
        </tolle-badge>
      </div>
    `,
  }),
};

// 5. Practical Usage (Notification dots & Status)
export const Notification: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex items-center gap-4">
        <div class="relative inline-flex">
          <i class="ri-notification-3-line text-4xl"></i>
          <tolle-badge variant="destructive" size="xs" class="absolute -top-1 -right-1 px-1 min-w-[1.25rem]">
            99+
          </tolle-badge>
        </div>

        <tolle-badge variant="outline" class="gap-1.5">
          <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
          System Online
        </tolle-badge>
      </div>
    `,
  }),
};
