import { Component } from '@angular/core';
import {
  AlertDialogComponent,
  AlertDialogTriggerComponent,
  AlertDialogPortalComponent,
  AlertDialogContentComponent,
  AlertDialogHeaderComponent,
  AlertDialogFooterComponent,
  AlertDialogTitleComponent,
  AlertDialogDescriptionComponent,
  AlertDialogActionComponent,
  AlertDialogCancelComponent,
} from '../../../../../../tolle/src/lib/alert-dialog.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
  selector: 'app-basic-alert-dialog',
  imports: [
    AlertDialogComponent,
    AlertDialogTriggerComponent,
    AlertDialogPortalComponent,
    AlertDialogContentComponent,
    AlertDialogHeaderComponent,
    AlertDialogFooterComponent,
    AlertDialogTitleComponent,
    AlertDialogDescriptionComponent,
    AlertDialogActionComponent,
    AlertDialogCancelComponent,
    ButtonComponent,
  ],
  template: `
    <tolle-alert-dialog>
      <tolle-alert-dialog-trigger>
        <tolle-button variant="destructive">Delete account</tolle-button>
      </tolle-alert-dialog-trigger>
      <tolle-alert-dialog-portal>
        <tolle-alert-dialog-content size="sm">
          <tolle-alert-dialog-header>
            <tolle-alert-dialog-title>Are you absolutely sure?</tolle-alert-dialog-title>
            <tolle-alert-dialog-description>
              This permanently deletes your account and removes your data from our servers.
            </tolle-alert-dialog-description>
          </tolle-alert-dialog-header>
          <tolle-alert-dialog-footer>
            <!-- Cancel and action close the dialog themselves; listen for the outcome. -->
            <tolle-alert-dialog-cancel (cancelled)="lastResult = 'cancelled'">
              <tolle-button variant="outline">Cancel</tolle-button>
            </tolle-alert-dialog-cancel>
            <tolle-alert-dialog-action (confirmed)="deleteAccount()">
              <tolle-button variant="destructive">Delete</tolle-button>
            </tolle-alert-dialog-action>
          </tolle-alert-dialog-footer>
        </tolle-alert-dialog-content>
      </tolle-alert-dialog-portal>
    </tolle-alert-dialog>

    <p class="mt-4 text-sm text-muted-foreground">Last result: {{ lastResult }}</p>
  `,
})
export class BasicAlertDialogComponent {
  lastResult = 'none';

  deleteAccount() {
    this.lastResult = 'deleted';
  }
}
