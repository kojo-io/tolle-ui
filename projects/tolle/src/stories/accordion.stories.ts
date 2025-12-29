import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {AccordionComponent} from '../lib/accordion.component';
import {AccordionItemComponent} from '../lib/accordion-item.component';

const meta: Meta<AccordionComponent> = {
  title: 'UI/Accordion',
  component: AccordionComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [AccordionComponent, AccordionItemComponent],
    }),
  ],
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Determines if one or multiple items can be open at the same time.',
    },
    class: {
      control: 'text',
      description: 'Custom classes for the wrapper',
      defaultValue: 'w-full'
    },
  },
  args: {
    type: 'single',
    class: '',
  },
};

export default meta;
type Story = StoryObj<AccordionComponent>;

// --- Stories ---

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tolle-accordion [type]="type" [class]="class">

          <tolle-accordion-item title="Is it accessible?">
            Yes. It adheres to the WAI-ARIA design pattern.
          </tolle-accordion-item>

          <tolle-accordion-item title="Is it styled?">
            Yes. It comes with default styles that matches the other components' aesthetic.
          </tolle-accordion-item>

          <tolle-accordion-item title="Is it animated?">
            No, it uses static rendering for a snappy, high-performance feel.
          </tolle-accordion-item>

        </tolle-accordion>
    `,
  }),
};

export const MultipleOpen: Story = {
  args: {
    type: 'multiple',
  },
  parameters: {
    docs: {
      description: {
        story: 'Set `type="multiple"` to allow expanding multiple sections at once.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full p-4">
        <tolle-accordion [type]="'multiple'" [class]="class">

          <tolle-accordion-item title="Is it accessible?">
            Yes. It adheres to the WAI-ARIA design pattern.
          </tolle-accordion-item>

          <tolle-accordion-item title="Is it styled?">
            Yes. It comes with default styles that matches the other components' aesthetic.
          </tolle-accordion-item>

          <tolle-accordion-item title="Is it animated?">
            No, it uses static rendering for a snappy, high-performance feel.
          </tolle-accordion-item>

        </tolle-accordion>
      </div>
    `,
  }),
};
