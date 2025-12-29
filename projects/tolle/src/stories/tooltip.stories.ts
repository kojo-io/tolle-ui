import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {BadgeComponent} from '../lib/badge.component';
import {TooltipDirective} from '../lib/tooltip.directive';
import {ButtonComponent} from '../lib/button.component';

const meta: Meta = {
  title: 'UI/Tooltip',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [TooltipDirective, ButtonComponent, BadgeComponent],
    }),
  ],
  argTypes: {
    content: {
      control: 'text',
      description: 'The text content to display inside the tooltip',
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'The preferred position of the tooltip relative to the host',
    },
  },
};

export default meta;

// 1. Basic usage on a Button
export const OnButton: StoryObj = {
  args: {
    content: 'Edit Profile',
    placement: 'top',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-20 flex justify-center">
        <tolle-button
          variant="outline"
          size="icon"
          [tolleTooltip]="content"
          [placement]="placement"
        >
          <i class="ri-edit-line"></i>
        </tolle-button>
      </div>
    `,
  }),
};

// 2. Different Placements
export const Placements: StoryObj = {
  render: () => ({
    template: `
      <div class="flex gap-2">
        <tolle-button tolleTooltip="Top Tooltip" placement="top">Top</tolle-button>
        <tolle-button tolleTooltip="Bottom Tooltip" placement="bottom">Bottom</tolle-button>
        <tolle-button tolleTooltip="Left Tooltip" placement="left">Left</tolle-button>
        <tolle-button tolleTooltip="Right Tooltip" placement="right">Right</tolle-button>
      </div>
    `,
  }),
};

// 3. Integration with Badges
export const OnBadge: StoryObj = {
  render: () => ({
    template: `
      <div class="p-20 flex justify-center">
        <tolle-badge
          variant="secondary"
          tolleTooltip="This account has been verified by our team"
          class="cursor-help"
        >
          <i prefix class="ri-shield-check-line"></i>
          Verified
        </tolle-badge>
      </div>
    `,
  }),
};
