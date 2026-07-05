import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../../../../tolle/src/lib/modal.service';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';

@Component({
    selector: 'app-modal-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent,
        SwitchComponent,
        InputComponent,
        LabelComponent
    ],
    template: `
    <section class="space-y-6">
      <h2 class="text-xl font-semibold tracking-tight text-foreground">Interactive Playground</h2>
      
      <app-playground [code]="codeSnippet">
        <div preview class="flex items-center justify-center min-h-[300px] w-full">
          <div class="text-center space-y-4">
            <p class="text-sm text-muted-foreground max-w-xs mx-auto">
              The modal opens in an overlay. Configure the options and click the button to see it in action.
            </p>
            <tolle-button (click)="openDemo()">Launch Demo Modal</tolle-button>
          </div>
        </div>

        <div controls class="space-y-5">
          <div class="space-y-1.5">
            <tolle-label>Title</tolle-label>
            <tolle-input [(ngModel)]="title" size="sm" placeholder="Modal title" />
          </div>

          <div class="space-y-1.5">
            <tolle-label>Size</tolle-label>
            <tolle-select [(ngModel)]="size" size="sm">
              <tolle-select-item value="xs">XS (320px)</tolle-select-item>
              <tolle-select-item value="sm">SM (425px)</tolle-select-item>
              <tolle-select-item value="default">Default (544px)</tolle-select-item>
              <tolle-select-item value="lg">LG (1024px)</tolle-select-item>
              <tolle-select-item value="fullscreen">Fullscreen</tolle-select-item>
            </tolle-select>
          </div>

          <label class="flex items-center justify-between text-sm font-medium">
            <span>Close Button</span>
            <tolle-switch [(ngModel)]="showCloseButton" size="sm" />
          </label>

          <label class="flex items-center justify-between text-sm font-medium">
            <span>Backdrop Close</span>
            <tolle-switch [(ngModel)]="backdropClose" size="sm" />
          </label>
        </div>
      </app-playground>
    </section>
  `
})
export class ModalInteractiveComponent {
    private modalService = inject(ModalService);

    title = 'Interactive Demo';
    size: 'xs' | 'sm' | 'default' | 'lg' | 'fullscreen' = 'default';
    showCloseButton = true;
    backdropClose = true;

    openDemo() {
        this.modalService.open({
            title: this.title,
            size: this.size,
            showCloseButton: this.showCloseButton,
            backdropClose: this.backdropClose,
            content: 'This modal was configured using the interactive controls in the playground!'
        });
    }

    get codeSnippet(): string {
        return `// Inject ModalService in your component
constructor(private modalService: ModalService) {}

openModal() {
  this.modalService.open({
    title: '${this.title}',
    size: '${this.size}',
    showCloseButton: ${this.showCloseButton},
    backdropClose: ${this.backdropClose},
    content: '...'
  });
}`;
    }
}
