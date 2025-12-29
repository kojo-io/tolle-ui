import type { Meta, StoryObj } from '@storybook/angular';
import {ButtonComponent} from '../lib/button.component';

// Define the metadata for the story
const meta: Meta<ButtonComponent> = {
  title: 'UI/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  // Define controls for the inputs
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon-xs', 'icon-sm', 'icon', 'icon-lg'],
      description: 'Size dimensions of the button',
    },
    disabled: {
      control: 'boolean',
    },
    busy: {
      control: 'boolean',
      description: 'Shows loading spinner and disables interaction',
    }
  },
  // Default args for all stories
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
    busy: false,
  },
  // Custom render function to handle ng-content
  render: (args) => {
    const { label, ...props } = args as any;
    return {
      props,
      template: `
        <tolle-button
          [variant]="variant"
          [size]="size"
          [disabled]="disabled"
          [busy]="busy"
          [class]="class"
        >
         Button
        </tolle-button>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

// --- Stories ---

// 1. The interactive playground
export const Playground: Story = {};

// 2. Variants
export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
  },
};

// 3. States
export const Busy: Story = {
  args: {
    busy: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The busy state reveals the SVG spinner defined in the component template and hides the text.',
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    class:'w-full',
  },
};

// 4. Icon Usage
// We override the template here to inject an actual icon for visual testing
export const IconOnly: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
  },
  render: (args) => ({
    props: args,
    template: `
      <tolle-button [variant]="variant" [size]="size">
        <i class="ri-settings-3-line"></i>
      </tolle-button>
    `,
  }),
};

export const TextWithIcon: Story = {
  args: {
    variant: 'default',
    size: 'default',
  },
  render: (args) => ({
    props: args,
    template: `
      <tolle-button [variant]="variant" [size]="size">
        <i class="ri-github-fill"></i>
        Source Code
      </tolle-button>
    `,
  }),
};
