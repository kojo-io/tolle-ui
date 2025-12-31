import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {EmptyStateComponent} from '../lib/empty-state.component';
import {ButtonComponent} from '../lib/button.component';

const meta: Meta<EmptyStateComponent> = {
  title: 'Components/Empty State',
  component: EmptyStateComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ButtonComponent],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'minimal'],
      description: 'The layout style of the empty state',
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
  },
  args: {
    variant: 'default',
    title: 'No items found',
    description: 'Try adjusting your search or filters to find what you are looking for.',
  },
};

export default meta;
type Story = StoryObj<EmptyStateComponent>;

// 1. Full Page Placeholder
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tolle-empty-state [variant]="variant" [title]="title" [description]="description">
        <i icon class="ri-search-2-line"></i>
        <div actions class="flex gap-2">
          <tolle-button variant="outline">Clear Filters</tolle-button>
          <tolle-button>Add New Item</tolle-button>
        </div>
      </tolle-empty-state>
    `,
  }),
};

// 2. Minimal (Inside a Small Container)
export const Minimal: Story = {
  args: {
    variant: 'minimal',
    title: 'No notifications',
    description: 'Check back later for updates.',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-72 border rounded-xl overflow-hidden shadow-sm bg-background">
        <div class="p-3 border-b font-medium text-sm">Notifications</div>
        <tolle-empty-state
          [variant]="variant"
          [title]="title"
          [description]="description">
          <i icon class="ri-notification-off-line"></i>
        </tolle-empty-state>
      </div>
    `,
  }),
};

// 3. File Upload Concept
export const FileUpload: Story = {
  args: {
    title: 'No documents yet',
    description: 'Get started by uploading your first project file.',
  },
  render: (args) => ({
    props: args,
    template: `
      <tolle-empty-state [title]="title" [description]="description">
        <i icon class="ri-file-upload-line"></i>
        <tolle-button actions>
          <i class="ri-upload-2-line mr-2"></i> Upload File
        </tolle-button>
      </tolle-empty-state>
    `,
  }),
};
