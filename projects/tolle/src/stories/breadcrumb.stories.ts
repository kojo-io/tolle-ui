import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {BreadcrumbComponent} from '../lib/breadcrumb.component';
import {BreadcrumbItemComponent} from '../lib/breadcrumb-item.component';
import {BreadcrumbLinkComponent} from '../lib/breadcrumb-link.component';
import {BreadcrumbSeparatorComponent} from '../lib/breadcrumb-separator.component';

const meta: Meta = {
  title: 'UI/Breadcrumb',
  decorators: [
    moduleMetadata({
      imports: [
        BreadcrumbComponent,
        BreadcrumbItemComponent,
        BreadcrumbLinkComponent,
        BreadcrumbSeparatorComponent,
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// 1. Basic Usage
export const Default: Story = {
  render: () => ({
    template: `
      <tolle-breadcrumb>
        <tolle-breadcrumb-item>
          <tolle-breadcrumb-link>Home</tolle-breadcrumb-link>
        </tolle-breadcrumb-item>

        <tolle-breadcrumb-separator></tolle-breadcrumb-separator>

        <tolle-breadcrumb-item>
          <tolle-breadcrumb-link>Components</tolle-breadcrumb-link>
        </tolle-breadcrumb-item>

        <tolle-breadcrumb-separator></tolle-breadcrumb-separator>

        <tolle-breadcrumb-item>
          <tolle-breadcrumb-link [active]="true">Breadcrumb</tolle-breadcrumb-link>
        </tolle-breadcrumb-item>
      </tolle-breadcrumb>
    `,
  }),
};

// 2. Custom Separator (Slash) and Icons
export const CustomSeparator: Story = {
  render: () => ({
    template: `
      <tolle-breadcrumb>
        <tolle-breadcrumb-item>
          <tolle-breadcrumb-link class="flex items-center gap-1">
            <i class="ri-home-4-line"></i>
          </tolle-breadcrumb-link>
        </tolle-breadcrumb-item>

        <tolle-breadcrumb-separator>/</tolle-breadcrumb-separator>

        <tolle-breadcrumb-item>
          <tolle-breadcrumb-link>Settings</tolle-breadcrumb-link>
        </tolle-breadcrumb-item>

        <tolle-breadcrumb-separator>/</tolle-breadcrumb-separator>

        <tolle-breadcrumb-item>
          <tolle-breadcrumb-link [active]="true">Profile</tolle-breadcrumb-link>
        </tolle-breadcrumb-item>
      </tolle-breadcrumb>
    `,
  }),
};

// 3. Collapsed / Long Path Example
export const LongPath: Story = {
  render: () => ({
    template: `
      <tolle-breadcrumb>
        <tolle-breadcrumb-item>
          <tolle-breadcrumb-link>Home</tolle-breadcrumb-link>
        </tolle-breadcrumb-item>
        <tolle-breadcrumb-separator></tolle-breadcrumb-separator>
        <tolle-breadcrumb-item>
          <span class="flex h-5 w-5 items-center justify-center">
            <i class="ri-more-fill"></i>
          </span>
        </tolle-breadcrumb-item>
        <tolle-breadcrumb-separator></tolle-breadcrumb-separator>
        <tolle-breadcrumb-item>
          <tolle-breadcrumb-link>Documents</tolle-breadcrumb-link>
        </tolle-breadcrumb-item>
        <tolle-breadcrumb-separator></tolle-breadcrumb-separator>
        <tolle-breadcrumb-item>
          <tolle-breadcrumb-link [active]="true">Project_Final_v2.pdf</tolle-breadcrumb-link>
        </tolle-breadcrumb-item>
      </tolle-breadcrumb>
    `,
  }),
};
