import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MaskedInputComponent} from '../lib/masked-input.component';

// 1. Wrapper Component for Form Logic
@Component({
    selector: 'masked-story-wrapper',
    imports: [CommonModule, ReactiveFormsModule, MaskedInputComponent],
    template: `
    <div class="p-10 space-y-6 max-w-md bg-background border rounded-xl">
      <h3 class="font-bold text-lg">Input Masking Demo</h3>

      <div class="space-y-1">
        <label class="text-sm font-medium">Phone Number</label>
        <tolle-masked-input
          mask="(000) 000-0000"
          placeholder="(555) 000-0000"
          [returnRaw]="returnRaw"
          [formControl]="phoneControl"
        >
          <i prefix class="ri-phone-line"></i>
        </tolle-masked-input>

        <div class="p-2 bg-muted rounded text-xs font-mono mt-2">
          <strong>Model Value:</strong> "{{ phoneControl.value }}"
        </div>
        <p class="text-xs text-muted-foreground mt-1">
          Type "1234567890". <br>
          Toggle <code>returnRaw</code> in Controls to see the value change.
        </p>
      </div>

      <div class="space-y-1 pt-4 border-t">
        <label class="text-sm font-medium">Credit Card</label>
        <tolle-masked-input
          mask="0000 0000 0000 0000"
          placeholder="0000 0000 0000 0000"
        >
          <i prefix class="ri-bank-card-line"></i>
        </tolle-masked-input>
      </div>
    </div>
  `
})
class MaskedWrapperComponent {
  phoneControl = new FormControl('');

  // Expose input to Storybook controls
  @Input() returnRaw = true;
}

// 2. Metadata Configuration
const meta: Meta<MaskedInputComponent> = {
  title: 'Components/Masked Input',
  component: MaskedInputComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MaskedWrapperComponent, CommonModule, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    mask: {
      control: 'text',
      description: 'Pattern string (0=digit, a=letter, *=alphanumeric)',
    },
    returnRaw: {
      control: 'boolean',
      description: 'If true, the FormControl value excludes mask characters.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<MaskedInputComponent>;

// --- Stories ---

// 1. The Interactive Form Playground
export const InteractiveForm: Story = {
  args: {
    returnRaw: true,
  },
  render: (args) => ({
    props: args,
    template: `<masked-story-wrapper [returnRaw]="returnRaw"></masked-story-wrapper>`,
  }),
};

// 3. License Key (Custom Class for Monospace)
export const LicenseKey: Story = {
  args: {
    mask: '****-****-****-****',
    placeholder: 'XXXX-XXXX-XXXX-XXXX',
    class: 'font-mono uppercase',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-10 max-w-sm">
        <label class="text-sm font-medium mb-1 block">Product Key</label>
        <tolle-masked-input
          [mask]="mask"
          [placeholder]="placeholder"
          [class]="class">
          <i prefix class="ri-key-2-line"></i>
        </tolle-masked-input>
      </div>
    `,
  }),
};

// 4. Suffix Usage (Units)
export const WithSuffix: Story = {
  args: {
    mask: '000',
    placeholder: '000',
    size: 'sm',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-10 max-w-[150px]">
        <label class="text-sm font-medium mb-1 block">Weight</label>
        <tolle-masked-input [mask]="mask" [placeholder]="placeholder" [size]="size">
          <span suffix class="text-xs font-bold text-muted-foreground">kg</span>
        </tolle-masked-input>
      </div>
    `,
  }),
};
