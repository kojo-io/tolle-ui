import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../../tolle/src/lib/toast.service';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-basic-toaster-example',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    template: `
    <div class="flex flex-wrap gap-2">
      <tolle-button (click)="showDefault()">Default Toast</tolle-button>
      <tolle-button (click)="showSuccess()" variant="secondary">Success Toast</tolle-button>
      <tolle-button (click)="showDestructive()" variant="destructive">Destructive Toast</tolle-button>
    </div>
  `
})
export class BasicToasterExampleComponent {
    private toastService = inject(ToastService);

    showDefault() {
        this.toastService.show({
            title: 'Default Toast',
            description: 'This is a default toast notification.'
        });
    }

    showSuccess() {
        this.toastService.show({
            title: 'Success!',
            description: 'Your action was completed successfully.',
            variant: 'success'
        });
    }

    showDestructive() {
        this.toastService.show({
            title: 'Error',
            description: 'Something went wrong. Please try again.',
            variant: 'destructive'
        });
    }
}
