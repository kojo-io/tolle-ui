import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { Component, Input } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DataTableComponent, TableColumn } from '../lib/data-table.component';
import { TolleCellDirective } from '../lib/tolle-cell.directive';
import { BadgeComponent } from '../lib/badge.component';
import { ButtonComponent } from '../lib/button.component';

// --- DOCUMENTATION SOURCE SNIPPETS ---

const TS_CODE_DEFAULT = `
import { Component } from '@angular/core';
import { TableColumn } from '@tolle_/tolle-ui';

@Component({ ... })
export class MyTableComponent {
  data = [ ... ]; // User Data

  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status' },
    { key: 'joined', label: 'Joined Date', sortable: true },
  ];
}
`;

const HTML_CODE_DEFAULT = `
<tolle-data-table
  [data]="data"
  [columns]="columns"
  [searchable]="true"
  [paginate]="true"
  [pageSize]="5">

  <ng-template tolleCell="status" let-value>
    <tolle-badge [variant]="value === 'Active' ? 'default' : 'secondary'">
      {{ value }}
    </tolle-badge>
  </ng-template>

  <ng-template tolleCell="name" let-value let-row="row">
    <div class="flex flex-col">
      <span class="font-medium">{{ value }}</span>
      <span class="text-xs text-muted-foreground">ID: {{ row.id }}</span>
    </div>
  </ng-template>
</tolle-data-table>
`;

const HTML_CODE_COMPACT = `
<!-- Use size="sm" or "xs" for denser layouts -->
<tolle-data-table
  [data]="data"
  [columns]="columns"
  size="sm"
  [searchable]="true"
  [paginate]="true"
  [pageSize]="10">

  <!-- Cell templates... -->
</tolle-data-table>
`;

const HTML_CODE_EXPANDABLE = `
<tolle-data-table
  [data]="data"
  [columns]="columns"
  [expandable]="true"
  [expandedTemplate]="expandTpl">
  <!-- Cell templates... -->
</tolle-data-table>

<ng-template #expandTpl let-row="row">
  <div class="grid grid-cols-2 gap-4 text-sm">
    <div class="space-y-1">
      <p class="font-semibold">Internal Metadata</p>
      <p class="text-muted-foreground">User GUID: ...</p>
    </div>
    <div class="flex items-center justify-end">
      <tolle-button variant="outline" size="sm">Manage User</tolle-button>
    </div>
  </div>
</ng-template>
`;

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
    imports: [DataTableComponent, TolleCellDirective, BadgeComponent, ButtonComponent],
    template: `
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
  `
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
  title: 'Components/Data Table',
  tags: ['autodocs'],
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
    size: 'xs',
    pageSize: 10,
  },
  render: args => ({
    props: args,
    template: `<data-table-wrapper v-bind="args"></data-table-wrapper>`,
  }),
  parameters: {
    docs: {
      source: {
        code: `/* --- component.ts --- */\n${TS_CODE_DEFAULT.trim()}\n\n/* --- component.html --- */\n${HTML_CODE_DEFAULT.trim()}`,
        language: 'typescript',
      },
    },
  },
};

export const Compact: StoryObj = {
  args: { size: 'sm', pageSize: 10 },
  render: args => ({
    props: args,
    template: `<data-table-wrapper [size]="size" [pageSize]="pageSize"></data-table-wrapper>`,
  }),
  parameters: {
    docs: {
      source: {
        code: `/* --- component.ts --- */\n${TS_CODE_DEFAULT.trim()}\n\n/* --- component.html --- */\n${HTML_CODE_COMPACT.trim()}`,
        language: 'typescript',
      },
    },
  },
};

export const Expandable: StoryObj = {
  args: { expandable: true },
  render: args => ({
    props: args,
    template: `<data-table-wrapper [expandable]="expandable"></data-table-wrapper>`,
  }),
  parameters: {
    docs: {
      source: {
        code: `/* --- component.ts --- */\n${TS_CODE_DEFAULT.trim()}\n\n/* --- component.html --- */\n${HTML_CODE_EXPANDABLE.trim()}`,
        language: 'typescript',
      },
    },
  },
};

export const SmallDataTable: StoryObj = {
  args: {
    size: 'sm',
    pageSize: 10,
  },

  render: args => ({
    props: args,
    template: `<data-table-wrapper v-bind="args"></data-table-wrapper>`,
  }),

  parameters: {
    docs: {
      source: {
        code: `/* --- component.ts --- */\n${TS_CODE_DEFAULT.trim()}\n\n/* --- component.html --- */\n${HTML_CODE_DEFAULT.trim()}`,
        language: 'typescript',
      },
    },
  },
};
