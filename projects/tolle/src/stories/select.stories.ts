import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import {SelectComponent} from '../lib/select.component';
import {SelectItemComponent} from '../lib/select-item.component';
import {SelectGroupComponent} from '../lib/select-group.component';
import {SelectSeparatorComponent} from '../lib/select-separator.component';
import {InputComponent} from '../lib/input.component';
import {ButtonComponent} from '../lib/button.component';

const meta: Meta<SelectComponent> = {
  title: 'Components/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SelectComponent,
        SelectItemComponent,
        SelectGroupComponent,
        SelectSeparatorComponent,
        InputComponent,
        ButtonComponent
      ],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg'],
    },
    searchable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
  args: {
    placeholder: 'Select an option',
    size: 'default',
    searchable: false,
    disabled: false,
    readonly: false,
  },
};

export default meta;
type Story = StoryObj<SelectComponent>;

// 1. Basic usage with simple items
export const Basic: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-xs p-10">
        <tolle-select [placeholder]="placeholder" [size]="size" [disabled]="disabled" [readonly]="readonly">
          <tolle-select-item value="apple">Apple</tolle-select-item>
          <tolle-select-item value="banana">Banana</tolle-select-item>
          <tolle-select-item value="orange">Orange</tolle-select-item>
        </tolle-select>
      </div>
    `,
  }),
};

// 2. Searchable with many options
export const Searchable: Story = {
  args: {
    searchable: true,
    placeholder: 'Select a country...',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-xs p-10">
        <tolle-select [searchable]="true" [placeholder]="placeholder">
          <tolle-select-item value="us">United States</tolle-select-item>
          <tolle-select-item value="de">Germany</tolle-select-item>
          <tolle-select-item value="gh">Ghana</tolle-select-item>
          <tolle-select-item value="fr">France</tolle-select-item>
          <tolle-select-item value="uk">United Kingdom</tolle-select-item>
          <tolle-select-item value="ca">Canada</tolle-select-item>
        </tolle-select>
      </div>
    `,
  }),
};

// 3. Grouped options with Separators
export const Grouped: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-xs p-10">
        <tolle-select placeholder="Select a timezone...">
          <tolle-select-group>North America</tolle-select-group>
          <tolle-select-item value="est">Eastern Standard Time (EST)</tolle-select-item>
          <tolle-select-item value="pst">Pacific Standard Time (PST)</tolle-select-item>

          <tolle-select-separator></tolle-select-separator>

          <tolle-select-group>Europe</tolle-select-group>
          <tolle-select-item value="gmt">Greenwich Mean Time (GMT)</tolle-select-item>
          <tolle-select-item value="cet">Central European Time (CET)</tolle-select-item>
        </tolle-select>
      </div>
    `,
  }),
};

// 4. Custom Rich Content in Items
export const RichContent: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-xs p-10">
        <tolle-select placeholder="Assign developer...">
          <tolle-select-item value="jd">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-700 text-[10px] flex items-center justify-center font-bold">JD</div>
              <div class="flex flex-col">
                <span class="text-sm">John Doe</span>
                <span class="text-[10px] opacity-50">john&commat;example.com</span>
              </div>
            </div>
          </tolle-select-item>
          <tolle-select-item value="as">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-purple-500/20 text-purple-700 text-[10px] flex items-center justify-center font-bold">AS</div>
              <div class="flex flex-col">
                <span class="text-sm">Alice Smith</span>
                <span class="text-[10px] opacity-50">alice&commat;example.com</span>
              </div>
            </div>
          </tolle-select-item>
        </tolle-select>
      </div>
    `,
  }),
};

// 5. Layout Integration (Toolbar example)
export const ToolbarExample: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="p-10 flex items-center gap-2 bg-muted/20">
        <tolle-select size="xs" placeholder="Sort by" class="w-32">
          <tolle-select-item value="new">Newest</tolle-select-item>
          <tolle-select-item value="old">Oldest</tolle-select-item>
        </tolle-select>

        <tolle-input size="xs" placeholder="Filter..." class="w-40">
          <i prefix class="ri-filter-3-line"></i>
        </tolle-input>

        <tolle-button size="xs">Apply</tolle-button>
      </div>
    `,
  }),
};
