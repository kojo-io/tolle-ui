import { Component, inject } from '@angular/core';
import { AlertDialogService } from '../../../../../../tolle/src/lib/alert-dialog.service';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
  selector: 'app-alert-dialog-service',
  imports: [ButtonComponent],
  template: `
    <tolle-button variant="destructive" (click)="confirmDelete()">Delete project</tolle-button>
    <p class="mt-4 text-sm text-muted-foreground">Confirmed: {{ confirmed ?? '—' }}</p>
  `,
})
export class AlertDialogServiceComponent {
  private alertDialog = inject(AlertDialogService);
  confirmed: boolean | null = null;

  confirmDelete() {
    const ref = this.alertDialog.open({
      title: 'Delete project?',
      description: 'This permanently deletes the project. This action cannot be undone.',
      actionText: 'Delete',
      cancelText: 'Keep it',
      variant: 'destructive',
      size: 'sm',
    });
    // true when the action button was clicked, false on cancel / dismiss.
    ref.afterClosed$.subscribe((result) => (this.confirmed = result));
  }
}
