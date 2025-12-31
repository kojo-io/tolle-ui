import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {SkeletonComponent} from '../lib/skeleton.component';
import {CardComponent, CardContentComponent, CardHeaderComponent} from '../lib/card.component';

const meta: Meta<SkeletonComponent> = {
  title: 'Components/Skeleton',
  component: SkeletonComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SkeletonComponent, CardComponent, CardHeaderComponent, CardContentComponent],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['rect', 'circle', 'pill'],
      description: 'The shape of the skeleton loader',
    },
    class: {
      control: 'text',
      description: 'Tailwind classes to define width, height, and margins',
    },
  },
  args: {
    variant: 'rect',
  },
};

export default meta;
type Story = StoryObj<SkeletonComponent>;

// 1. Standalone shapes
export const Basic: Story = {
  args: {
    class: 'h-4 w-[250px]',
  },
};

export const Shapes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex items-center gap-4">
        <tolle-skeleton variant="circle" class="h-12 w-12"></tolle-skeleton>
        <div class="space-y-2">
          <tolle-skeleton variant="rect" class="h-4 w-[200px]"></tolle-skeleton>
          <tolle-skeleton variant="rect" class="h-4 w-[150px]"></tolle-skeleton>
        </div>
      </div>
    `,
  }),
};

// 2. Card Loading State (Matches your usage example)
export const CardLoading: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-sm">
        <tolle-card>
          <tolle-card-header class="flex flex-row items-center gap-4">
            <tolle-skeleton variant="circle" class="h-12 w-12"></tolle-skeleton>
            <div class="space-y-2 flex flex-col">
              <tolle-skeleton class="h-4 w-32"></tolle-skeleton>
              <tolle-skeleton class="h-3 w-24"></tolle-skeleton>
            </div>
          </tolle-card-header>

          <tolle-card-content class="space-y-4 flex flex-col">
            <tolle-skeleton class="h-4 w-full"></tolle-skeleton>
            <tolle-skeleton class="h-4 w-full"></tolle-skeleton>
            <tolle-skeleton class="h-4 w-3/4"></tolle-skeleton>

            <tolle-skeleton class="h-10 w-full mt-4"></tolle-skeleton>
          </tolle-card-content>
        </tolle-card>
      </div>
    `,
  }),
};

// 3. List Item Loading
export const ListLoading: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="space-y-6 w-[300px]">
        <div *ngFor="let i of [1,2,3]" class="flex items-center space-x-4">
          <tolle-skeleton variant="circle" class="h-10 w-10"></tolle-skeleton>
          <div class="space-y-2 flex flex-col">
            <tolle-skeleton class="h-4 w-[150px]"></tolle-skeleton>
            <tolle-skeleton class="h-4 w-[100px]"></tolle-skeleton>
          </div>
        </div>
      </div>
    `,
  }),
};
