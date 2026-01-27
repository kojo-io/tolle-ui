import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { Component, inject, Input } from '@angular/core';
import { ToastContainerComponent } from '../lib/toaster.component';
import { ButtonComponent } from '../lib/button.component';
import { ToastPosition, ToastService } from '../lib/toast.service';
import { provideAnimations } from '@angular/platform-browser/animations';

// 1. Define Source Code for Documentation
const TS_CODE = `
import { Component, inject } from '@angular/core';
import { ToastService } from '@tolle_/tolle-ui';

@Component({ ... })
export class MyComponent {
  private toast = inject(ToastService);

  showSuccess() {
    this.toast.show({
      title: 'Success',
      description: 'Action completed successfully.',
      variant: 'success',
    });
  }
}
`;

const HTML_CODE = `
<tolle-button (click)="showSuccess()">
  Show Toast
</tolle-button>

<!-- Usually placed once in app.component.html -->
<tolle-toaster position="top-right" />
`;

// 2. Define the Wrapper Component
@Component({
    selector: 'toast-story-wrapper',
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
  `
})
class ToastStoryWrapper {
  @Input() position: ToastPosition = 'top-right';
  toast = inject(ToastService);
}

// 3. Configure the Story Metadata
const meta: Meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [ToastService, provideAnimations()],
    }),
    moduleMetadata({
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
  args: {
    position: 'top-right',
  },
};

export default meta;
type Story = StoryObj;

// 4. Render using the Template approach
export const InteractiveDemo: Story = {
  args: {
    position: 'top-right', // Default position for the demo
  },
  render: args => ({
    props: args,
    template: `<toast-story-wrapper [position]="position"></toast-story-wrapper>`,
  }),
  parameters: {
    docs: {
      source: {
        code: `
/* --- example.component.ts --- */
${TS_CODE.trim()}

/* --- example.component.html --- */
${HTML_CODE.trim()}
        `,
        language: 'typescript'
      }
    }
  }
};
