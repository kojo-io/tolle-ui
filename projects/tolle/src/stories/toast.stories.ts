import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { Component, inject, Input } from '@angular/core';
import { ToastContainerComponent } from '../lib/toaster.component';
import { ButtonComponent } from '../lib/button.component';
import { ToastPosition, ToastService } from '../lib/toast.service';
import { provideAnimations } from '@angular/platform-browser/animations';

// 1. Define the Wrapper Component
// This creates a valid Injection Context for the service
@Component({
  selector: 'toast-story-wrapper',
  standalone: true,
  imports: [ToastContainerComponent, ButtonComponent],
  template: `
    <div class="space-y-4 p-10">
      <h2 class="mb-4 text-lg font-bold">Toast Notifications</h2>
      <div class="flex flex-wrap gap-2">
        <tolle-button
          (click)="
            toast.show({
              title: 'Event Created',
              description: 'Your event has been successfully scheduled.',
              variant: 'default',
            })
          ">
          Default Toast
        </tolle-button>

        <tolle-button
          variant="secondary"
          (click)="
            toast.show({
              title: 'Success',
              description: 'Action completed successfully.',
              variant: 'success',
            })
          ">
          Success Toast
        </tolle-button>

        <tolle-button
          variant="destructive"
          (click)="
            toast.show({
              title: 'Error',
              description: 'Something went wrong.',
              variant: 'destructive',
              duration: 5000,
            })
          ">
          Destructive Toast
        </tolle-button>
      </div>

      <tolle-toaster [position]="position" />
    </div>
  `,
})
class ToastStoryWrapper {
  @Input() position: ToastPosition = 'top-right';
  // Safe to use inject() here because it's inside a class field initializer
  toast = inject(ToastService);
}

// 2. Configure the Story Metadata
const meta: Meta = {
  title: 'UI/Toast',
  decorators: [
    applicationConfig({
      providers: [ToastService, provideAnimations()],
    }),
    moduleMetadata({
      // IMPORTANT: Import the wrapper here so the template below recognizes it
      imports: [ToastStoryWrapper],
    }),
  ],
  argTypes: {
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center'],
      description: 'Position of the toast container viewport',
    },
  },
  // 2. Set Default
  args: {
    position: 'top-right',
  },
};

export default meta;
type Story = StoryObj;

// 3. Render using the Template approach
// This avoids the "inject() must be called from an injection context" error
export const InteractiveDemo: Story = {
  args: {
    position: 'top-center',
  },

  render: args => ({
    // 3. Pass args (which contains 'position') to the template
    props: args,
    template: `<toast-story-wrapper [position]="position"></toast-story-wrapper>`,
  }),
};
