import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PaginationComponent} from '../lib/pagination.component';
import {SelectComponent} from '../lib/select.component';
import {SelectItemComponent} from '../lib/select-item.component';

// 1. Wrapper to manage dynamic data updates
@Component({
  selector: 'pagination-story-wrapper',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  template: `
    <div class="p-8 space-y-8 bg-background border rounded-xl">
      <div>
        <h3 class="text-lg font-bold">Data Table Simulation</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Current Page: <strong>{{ page }}</strong> |
          Page Size: <strong>{{ size }}</strong>
        </p>
      </div>

      <tolle-pagination
        [totalRecords]="totalRecords"
        [currentPage]="page"
        [currentPageSize]="size"
        [showPageLinks]="showPageLinks"
        [showPageOptions]="showPageOptions"
        [showCurrentPageInfo]="showCurrentPageInfo"
        [currentPageInfoTemplate]="template"
        (onPageNumberChange)="page = $event"
        (onPageSizeChange)="size = $event"
      ></tolle-pagination>

      <div class="grid grid-cols-5 gap-2 mt-4">
        <div *ngFor="let i of [].constructor(size)" class="h-8 bg-muted animate-pulse rounded"></div>
      </div>
    </div>
  `
})
class PaginationWrapperComponent {
  @Input() totalRecords = 120;
  @Input() showPageLinks = true;
  @Input() showPageOptions = true;
  @Input() showCurrentPageInfo = true;
  @Input() template?: string;

  page = 1;
  size = 10;
}

const meta: Meta<PaginationComponent> = {
  title: 'Components/Pagination',
  component: PaginationComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        SelectComponent,
        SelectItemComponent,
        PaginationWrapperComponent
      ],
    }),
  ],
  argTypes: {
    totalRecords: { control: { type: 'number', min: 0 } },
    currentPageSize: { control: 'number' },
    showPageLinks: { control: 'boolean' },
    showPageOptions: { control: 'boolean' },
    showCurrentPageInfo: { control: 'boolean' },
  }
};

export default meta;
type Story = StoryObj<PaginationComponent>;

// --- Stories ---

export const Default: Story = {
  args: {
    totalRecords: 150,
    currentPageSize: 10,
  },
  render: (args) => ({
    props: args,
    template: `<pagination-story-wrapper
      [totalRecords]="totalRecords"
      [showPageLinks]="showPageLinks"
      [showPageOptions]="showPageOptions"
      [showCurrentPageInfo]="showCurrentPageInfo"
    ></pagination-story-wrapper>`,
  }),
};

export const CustomTemplate: Story = {
  args: {
    totalRecords: 1000,
    currentPageInfoTemplate: 'Displaying {first} - {last} of {totalRecords} files',
  },
  render: (args) => ({
    props: args,
    template: `<pagination-story-wrapper
      [totalRecords]="totalRecords"
      [template]="currentPageInfoTemplate"
    ></pagination-story-wrapper>`,
  }),
};

export const Minimal: Story = {
  args: {
    totalRecords: 50,
    showPageLinks: false,
    showPageOptions: false,
  },
  render: (args) => ({
    props: args,
    template: `<pagination-story-wrapper
      [totalRecords]="totalRecords"
      [showPageLinks]="showPageLinks"
      [showPageOptions]="showPageOptions"
    ></pagination-story-wrapper>`,
  }),
};
