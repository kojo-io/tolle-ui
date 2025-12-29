import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleComponent
} from '../lib/card.component';
import {ButtonComponent} from '../lib/button.component';
import {InputComponent} from '../lib/input.component';

const meta: Meta<CardComponent> = {
  title: 'UI/Card',
  component: CardComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        CardComponent,
        CardHeaderComponent,
        CardTitleComponent,
        CardContentComponent,
        CardFooterComponent,
        ButtonComponent,
        InputComponent
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<CardComponent>;

// 1. The Complex Example (Matches your usage)
export const FullExample: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="p-10 bg-muted/30 flex justify-center">
        <tolle-card class="max-w-md w-full">
          <tolle-card-header>
            <tolle-card-title class="flex items-center gap-2">
              <i class="ri-palette-line text-primary"></i>
              Theme Settings
            </tolle-card-title>
            <p class="text-sm text-muted-foreground">
              Derived colors will update as you change the primary.
            </p>
          </tolle-card-header>

          <tolle-card-content class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-bold uppercase text-muted-foreground">Primary Hex</label>
              <tolle-input [ngModel]="'#2563eb'">
                <i prefix class="ri-drop-line"></i>
              </tolle-input>
            </div>

            <div class="p-4 rounded-lg bg-secondary text-secondary-foreground text-sm">
              <strong>Pro Tip:</strong> This background is auto-generated using <code>color-mix</code>
              based on your primary color!
            </div>
          </tolle-card-content>

          <tolle-card-footer class="flex justify-between">
            <tolle-button variant="ghost">Cancel</tolle-button>
            <tolle-button>Save Changes</tolle-button>
          </tolle-card-footer>
        </tolle-card>
      </div>
    `,
  }),
};

// 2. Simple Statistics Card
export const StatCard: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tolle-card class="w-[250px]">
        <tolle-card-header>
          <tolle-card-title class="text-xs uppercase text-muted-foreground font-medium">Total Revenue</tolle-card-title>
        </tolle-card-header>
        <tolle-card-content>
          <div class="text-2xl font-bold">$45,231.89</div>
          <p class="text-xs text-green-500 font-medium">+20.1% from last month</p>
        </tolle-card-content>
      </tolle-card>
    `,
  }),
};

// 3. Simple Header/Content only
export const Basic: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tolle-card class="w-[350px]">
        <tolle-card-header>
          <tolle-card-title>Simple Card</tolle-card-title>
        </tolle-card-header>
        <tolle-card-content>
          This is a basic card with just a header and some content. Minimalist and clean.
        </tolle-card-content>
      </tolle-card>
    `,
  }),
};

// 2. Pricing / Feature Card
export const PricingPlan: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="p-10 flex justify-center w-full">
        <tolle-card class="w-full border-primary ring-1 ring-primary">
          <tolle-card-header>
            <div class="px-3 py-1 text-[10px] font-bold text-primary bg-primary/10 rounded-full w-fit mb-2">MOST POPULAR</div>
            <tolle-card-title>Pro Plan</tolle-card-title>
            <div class="flex items-baseline gap-1 mt-2">
              <span class="text-3xl font-bold">$49</span>
              <span class="text-muted-foreground text-sm">/month</span>
            </div>
          </tolle-card-header>
          <tolle-card-content class="space-y-3">
            <div class="flex items-center gap-2 text-sm">
              <i class="ri-checkbox-circle-fill text-primary"></i>
              <span>Unlimited Projects</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="ri-checkbox-circle-fill text-primary"></i>
              <span>Priority Support</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="ri-checkbox-circle-fill text-primary"></i>
              <span>Advanced Analytics</span>
            </div>
          </tolle-card-content>
          <tolle-card-footer>
            <tolle-button class="w-full" size="lg">Get Started</tolle-button>
          </tolle-card-footer>
        </tolle-card>
      </div>
    `,
  }),
};

// 3. Notification / Activity Item
export const NotificationCard: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="p-10 flex justify-center">
        <tolle-card class="w-full max-w-lg">
          <tolle-card-content class="p-4 pt-4">
            <div class="flex items-start gap-4">
              <div class="mt-1 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <i class="ri-information-line"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium">New deployment successful</p>
                <p class="text-xs text-muted-foreground">Your project "tolle-ui-docs" was deployed to production 2 minutes ago.</p>
                <div class="mt-3 flex gap-3">
                  <button class="text-xs font-semibold text-primary hover:underline">View Logs</button>
                  <button class="text-xs font-semibold text-muted-foreground hover:underline">Dismiss</button>
                </div>
              </div>
            </div>
          </tolle-card-content>
        </tolle-card>
      </div>
    `,
  }),
};
