import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ToastService, ToastPosition } from '../../../../../../tolle/src/lib/toast.service';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { ToastContainerComponent } from '../../../../../../tolle/src/lib/toaster.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-toaster-interactive',
    imports: [
    FormsModule,
    PlaygroundComponent,
    ButtonComponent,
    SelectComponent,
    SelectItemComponent,
    ToastContainerComponent
],
    templateUrl: './toaster-interactive.component.html'
})
export class ToasterInteractiveComponent {
  private toastService = inject(ToastService);

  title = 'Notification Sent';
  description = 'Everything looks great! Your changes have been successfully applied.';
  variant: 'default' | 'success' | 'destructive' = 'default';
  position: ToastPosition = 'bottom-right';
  duration = 4000;

  triggerToast() {
    this.toastService.show({
      title: this.title,
      description: this.description,
      variant: this.variant,
      duration: this.duration
    });
  }

  get generatedCode() {
    return `// 1. Call the service in your component
this.toastService.show({
  title: '${this.title}',
  description: '${this.description}',
  variant: '${this.variant}',
  duration: ${this.duration}
});

// 2. Pair with a button in your template
<tolle-button (click)="trigger()">
  Show Notification
</tolle-button>

<!-- 3. Ensure the container is in your root template -->
<tolle-toaster position="${this.position}"></tolle-toaster>`;
  }
}
