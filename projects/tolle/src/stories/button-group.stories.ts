import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {ButtonGroupComponent} from '../lib/button-group.component';
import {ButtonComponent} from '../lib/button.component';

const meta: Meta<ButtonGroupComponent> = {
  title: 'Components/Button Group',
  component: ButtonGroupComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ButtonComponent],
    }),
  ],
  argTypes: {
    class: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ButtonGroupComponent>;

// 1. Standard Segmented Control (Pagination style)
export const Segmented: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tolle-button-group [class]="class">
        <tolle-button variant="outline">
          <i class="ri-arrow-left-s-line mr-2"></i> Previous
        </tolle-button>
        <tolle-button variant="outline">
          Next <i class="ri-arrow-right-s-line ml-2"></i>
        </tolle-button>
      </tolle-button-group>
    `,
  }),
};

// 2. View Toggle (Multi-option)
export const ViewToggle: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tolle-button-group [class]="class">
        <tolle-button variant="outline">Yearly</tolle-button>
        <tolle-button variant="outline">Monthly</tolle-button>
        <tolle-button variant="outline" class="bg-accent text-accent-foreground">Weekly</tolle-button>
        <tolle-button variant="outline">Daily</tolle-button>
      </tolle-button-group>
    `,
  }),
};

// 3. Icon Only Toolbar
export const IconToolbar: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tolle-button-group [class]="class">
        <tolle-button variant="outline" size="icon">
          <i class="ri-align-left"></i>
        </tolle-button>
        <tolle-button variant="outline" size="icon">
          <i class="ri-align-center"></i>
        </tolle-button>
        <tolle-button variant="outline" size="icon">
          <i class="ri-align-right"></i>
        </tolle-button>
      </tolle-button-group>
    `,
  }),
};

// 4. Mixed Variants (Warning/Action)
export const Mixed: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tolle-button-group [class]="class">
        <tolle-button variant="secondary">Keep Both</tolle-button>
        <tolle-button variant="destructive">Delete Old</tolle-button>
      </tolle-button-group>
    `,
  }),
};
