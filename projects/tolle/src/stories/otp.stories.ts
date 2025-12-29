import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import {OtpComponent} from '../lib/otp.component';
import {OtpGroupComponent} from '../lib/otp-group.component';
import {OtpSlotComponent} from '../lib/otp-slot.component';

const meta: Meta<OtpComponent> = {
  title: 'UI/OTP Input',
  component: OtpComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, OtpGroupComponent, OtpSlotComponent],
    }),
  ],
  argTypes: {
    length: { control: { type: 'number', min: 1, max: 10 } },
    auto: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<OtpComponent>;

// 1. Auto Mode (The easiest way to use the component)
export const Automated: Story = {
  args: {
    length: 6,
    auto: true,
  },
  render: (args) => ({
    props: { ...args, control: new FormControl('') },
    template: `
      <div class="space-y-4">
        <tolle-otp [length]="length" [auto]="auto" [formControl]="control"></tolle-otp>
        <p class="text-xs text-muted-foreground font-mono">Value: {{ control.value || 'empty' }}</p>
      </div>
    `,
  }),
};

export const CustomLayout: Story = {
  render: () => ({
    props: { control: new FormControl('') },
    template: `
      <div class="space-y-4">
        <tolle-otp #otp [length]="6" [formControl]="control">
          <div class="flex items-center gap-2">
            <tolle-otp-group>
              <tolle-otp-slot [isFirst]="true" [char]="control.value?.[0]" [isActive]="otp.isFocused && (control.value?.length || 0) === 0"></tolle-otp-slot>
              <tolle-otp-slot [char]="control.value?.[1]" [isActive]="otp.isFocused && control.value?.length === 1"></tolle-otp-slot>
              <tolle-otp-slot [isLast]="true" [char]="control.value?.[2]" [isActive]="otp.isFocused && control.value?.length === 2"></tolle-otp-slot>
            </tolle-otp-group>

            <div class="text-muted-foreground font-bold">-</div>

            <tolle-otp-group>
              <tolle-otp-slot [isFirst]="true" [char]="control.value?.[3]" [isActive]="otp.isFocused && control.value?.length === 3"></tolle-otp-slot>
              <tolle-otp-slot [char]="control.value?.[4]" [isActive]="otp.isFocused && control.value?.length === 4"></tolle-otp-slot>
              <tolle-otp-slot [isLast]="true" [char]="control.value?.[5]" [isActive]="otp.isFocused && control.value?.length === 5"></tolle-otp-slot>
            </tolle-otp-group>
          </div>
        </tolle-otp>
        <p class="text-sm font-medium">Please enter the 6-digit code sent to your phone.</p>
      </div>
    `,
  }),
};

// 3. Four Digit Simple
export const FourDigits: Story = {
  render: () => ({
    props: { control: new FormControl('') },
    template: `
      <tolle-otp #otp [length]="4" [formControl]="control">
        <tolle-otp-group>
          <tolle-otp-slot [isFirst]="true" [char]="control.value?.[0]" [isActive]="otp.isFocused && (control.value?.length || 0) === 0"></tolle-otp-slot>
          <tolle-otp-slot [char]="control.value?.[1]" [isActive]="otp.isFocused && control.value?.length === 1"></tolle-otp-slot>
          <tolle-otp-slot [char]="control.value?.[2]" [isActive]="otp.isFocused && control.value?.length === 2"></tolle-otp-slot>
          <tolle-otp-slot [isLast]="true" [char]="control.value?.[3]" [isActive]="otp.isFocused && control.value?.length === 3"></tolle-otp-slot>
        </tolle-otp-group>
      </tolle-otp>
    `,
  }),
};
