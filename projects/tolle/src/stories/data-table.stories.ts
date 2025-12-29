import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DataTableComponent, TableColumn } from '../lib/data-table.component';
import { TolleCellDirective } from '../lib/tolle-cell.directive';
import { BadgeComponent } from '../lib/badge.component';
import { ButtonComponent } from '../lib/button.component';

// 1. Mock Data Construction
const MOCK_USERS = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'Active',
    joined: '2023-01-12',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Editor',
    status: 'Inactive',
    joined: '2023-05-20',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'Viewer',
    status: 'Active',
    joined: '2023-08-15',
  },
  {
    id: 4,
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'Admin',
    status: 'Active',
    joined: '2022-11-02',
  },
  {
    id: 5,
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    role: 'Editor',
    status: 'Pending',
    joined: '2024-02-10',
  },
  {
    id: 6,
    name: 'Fiona Gallagher',
    email: 'fiona@example.com',
    role: 'Viewer',
    status: 'Active',
    joined: '2023-03-22',
  },
];

const COLUMNS: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'joined', label: 'Joined Date', sortable: true },
];

// 2. Wrapper Component to handle Templates
@Component({
  selector: 'data-table-wrapper',
  standalone: true,
  imports: [CommonModule, DataTableComponent, TolleCellDirective, BadgeComponent, ButtonComponent],
  template: `
    <div class="rounded-xl border bg-background p-8 shadow-sm">
      <tolle-data-table
        [data]="data"
        [columns]="columns"
        [size]="size"
        [searchable]="searchable"
        [paginate]="paginate"
        [expandable]="expandable"
        [pageSize]="pageSize"
        [expandedTemplate]="expandTpl">
        <ng-template tolleCell="status" let-value>
          <tolle-badge
            [variant]="
              value === 'Active' ? 'default' : value === 'Pending' ? 'secondary' : 'outline'
            ">
            {{ value }}
          </tolle-badge>
        </ng-template>

        <ng-template tolleCell="name" let-value let-row="row">
          <div class="flex flex-col">
            <span class="font-medium text-foreground">{{ value }}</span>
            <span class="text-xs text-muted-foreground">ID: {{ row.id }}</span>
          </div>
        </ng-template>
      </tolle-data-table>
    </div>

    <ng-template #expandTpl let-row="row">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="space-y-1">
          <p class="font-semibold">Internal Metadata</p>
          <p class="text-muted-foreground">User GUID: 550e8400-e29b-41d4-a716-446655440000</p>
        </div>
        <div class="flex items-center justify-end">
          <tolle-button variant="outline" size="sm">Manage User</tolle-button>
        </div>
      </div>
    </ng-template>
  `,
})
class DataTableWrapperComponent {
  @Input() data = MOCK_USERS;
  @Input() columns = COLUMNS;
  @Input() size: any = 'default';
  @Input() searchable = true;
  @Input() paginate = true;
  @Input() expandable = false;
  @Input() pageSize = 5;
}

// 3. Storybook Metadata
const meta: Meta = {
  title: 'UI/Data Table',
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({ imports: [DataTableWrapperComponent] }),
  ],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'default', 'lg'] },
    pageSize: { control: 'number' },
  },
};

export default meta;

export const Default: StoryObj = {
  args: {
    size: 'sm',
  },

  render: args => ({
    props: args,
    template: `<data-table-wrapper v-bind="args"></data-table-wrapper>`,
  }),
};

export const Compact: StoryObj = {
  args: { size: 'sm', pageSize: 10 },
  render: args => ({
    props: args,
    template: `<data-table-wrapper [size]="size" [pageSize]="pageSize"></data-table-wrapper>`,
  }),
};

export const Expandable: StoryObj = {
  args: { expandable: true },
  render: args => ({
    props: args,
    template: `<data-table-wrapper [expandable]="expandable"></data-table-wrapper>`,
  }),
};
