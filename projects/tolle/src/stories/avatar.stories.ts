import type { Meta, StoryObj } from '@storybook/angular';
import {AvatarComponent} from '../lib/avatar.component';

const meta: Meta<AvatarComponent> = {
  title: 'UI/Avatar',
  component: AvatarComponent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'The physical dimensions of the avatar',
    },
    shape: {
      control: 'radio',
      options: ['circle', 'square'],
      description: 'The border radius of the avatar container',
    },
    src: {
      control: 'text',
      description: 'URL of the image to display',
    },
  },
  args: {
    size: 'default',
    shape: 'circle',
    alt: 'User Avatar',
  },
};

export default meta;
type Story = StoryObj<AvatarComponent>;

// 1. Image Avatar
export const WithImage: Story = {
  args: {
    src: 'https://github.com/nutlope.png',
  },
};

// 2. Fallback (Initials or Icons)
export const Fallback: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tolle-avatar [size]="size" [shape]="shape" [src]="src">
        <div class="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium uppercase">
          JD
        </div>
      </tolle-avatar>
    `,
  }),
};

// 3. Size Comparison
export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex items-end gap-4">
        <tolle-avatar size="sm" src="https://github.com/nutlope.png"></tolle-avatar>
        <tolle-avatar size="default" src="https://github.com/nutlope.png"></tolle-avatar>
        <tolle-avatar size="lg" src="https://github.com/nutlope.png"></tolle-avatar>
        <tolle-avatar size="xl" src="https://github.com/nutlope.png"></tolle-avatar>
      </div>
    `,
  }),
};

// 4. Avatar Group (Stacked)
export const AvatarGroup: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex -space-x-4">
        <tolle-avatar class="ring-2 ring-background" src="https://github.com/shadcn.png"></tolle-avatar>
        <tolle-avatar class="ring-2 ring-background" src="https://github.com/nutlope.png"></tolle-avatar>
        <tolle-avatar class="ring-2 ring-background" src="https://github.com/vercel.png"></tolle-avatar>
        <tolle-avatar class="ring-2 ring-background">
          <div class="flex h-full w-full items-center justify-center bg-secondary text-[10px] font-bold">
            +5
          </div>
        </tolle-avatar>
      </div>
    `,
  }),
};
