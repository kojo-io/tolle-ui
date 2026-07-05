import { Component, inject } from '@angular/core';
import { ModalRef } from '../../../../../../tolle/src/lib/modal-ref';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-user-form',
    imports: [ButtonComponent],
    template: `
    <div class="space-y-4">
      <p class="text-sm text-muted-foreground">
        This component was loaded dynamically into the modal.
      </p>
      
      <div class="grid gap-2">
        <label class="text-sm font-medium">Username</label>
        <input type="text" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Enter username">
      </div>

      <div class="flex justify-end gap-2 pt-4">
        <tolle-button variant="ghost" (click)="ref.close()">Cancel</tolle-button>
        <tolle-button (click)="submit()">Save changes</tolle-button>
      </div>
    </div>
  `
})
export class UserFormComponent {
    ref = inject(ModalRef);

    submit() {
        console.log('Form submitted');
        this.ref.close({ status: 'success' });
    }
}
