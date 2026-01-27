import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '../lib/button.component';
import {ModalService} from '../lib/modal.service'; // Add CommonModule for ngIf

// 1. Define the "Real World" usage code as strings
const TS_CODE = `
import { Component } from '@angular/core';
import { ModalService } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  templateUrl: './example.html'
})
export class ExampleComponent {
  constructor(private modalService: ModalService) {}

  openModal() {
    this.modalService.open({
      content: 'This is a modal triggered from TypeScript!',
      size: 'default',
      backdropClose: true
    });
  }
}
`;

const HTML_CODE = `
<tolle-button (click)="openModal()">
  Open Modal
</tolle-button>
`;

// 2. Create a dummy component to actually run in the canvas
@Component({
    selector: 'modal-story-host',
    imports: [ButtonComponent, CommonModule], // Add CommonModule
    template: `
    <div class="p-4 flex flex-col gap-4 items-start">
      <tolle-button (click)="open()">Open Modal</tolle-button>
      <div *ngIf="lastEvent" class="text-sm text-muted-foreground">
        Last Event: {{ lastEvent }}
      </div>
    </div>
  `
})
class ModalStoryHost {
  @Input() size: "fullscreen" | "xs" | "sm" | "default" | "lg" = 'default';
  @Input() backdropClose = true;
  @Input() showCloseButton  = true;
  lastEvent = '';

  constructor(private modalService: ModalService) {}

  open() {
    const ref = this.modalService.open({
      content: 'Hello! I am a service-driven modal.',
      size: this.size,
      backdropClose: this.backdropClose,
      showCloseButton: this.showCloseButton
    });

    ref.afterClosed$.subscribe(res => this.lastEvent = `Closed (${res.type})`);
  }
}

// 3. Define Meta
const meta: Meta<ModalStoryHost> = {
  title: 'Components/Modal',
  component: ModalStoryHost,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ModalStoryHost], // Ensure the host component itself is imported here!
      providers: [ModalService]
    })
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ["fullscreen" , "xs" , "sm" , "default" , "lg"]
    }
  },
  // This helps clean up the args table to only show relevant controls
  parameters: {
    controls: { include: ['size', 'backdropClose'] }
  }
};

export default meta;
type Story = StoryObj<ModalStoryHost>;

// 4. The Default Story with Combined Source
export const Basic: Story = {
  args: {
    size: 'default',
    backdropClose: true,
    showCloseButton: true
  },
  parameters: {
    docs: {
      source: {
        // This overrides the "Show Code" button content
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
