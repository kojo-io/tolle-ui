import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  AlertDialogCancelComponent
} from '../../../../../../tolle/src/lib/alert-dialog.component';
import { AlertDialogService } from '../../../../../../tolle/src/lib/alert-dialog.service';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-alert-dialog-interactive',
    imports: [
        CommonModule,
        FormsModule,
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
        PlaygroundComponent,
        ButtonComponent
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview class="flex flex-col gap-4">
          <tolle-alert-dialog>
            <tolle-alert-dialog-trigger>
              <tolle-button variant="outline">Template-driven Trigger</tolle-button>
            </tolle-alert-dialog-trigger>
            <tolle-alert-dialog-portal>
              <tolle-alert-dialog-content>
                <tolle-alert-dialog-header>
                  <tolle-alert-dialog-title>Are you absolutely sure?</tolle-alert-dialog-title>
                  <tolle-alert-dialog-description>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </tolle-alert-dialog-description>
                </tolle-alert-dialog-header>
                <tolle-alert-dialog-footer>
                  <tolle-alert-dialog-cancel>
                    <tolle-button variant="outline">Cancel</tolle-button>
                  </tolle-alert-dialog-cancel>
                  <tolle-alert-dialog-action>
                    <tolle-button>Continue</tolle-button>
                  </tolle-alert-dialog-action>
                </tolle-alert-dialog-footer>
              </tolle-alert-dialog-content>
            </tolle-alert-dialog-portal>
          </tolle-alert-dialog>

          <tolle-button (click)="openFromService()">Service-based Trigger</tolle-button>
        </div>
      </app-playground>
    </section>
  `
})
export class AlertDialogInteractiveComponent {
  private alertDialog = inject(AlertDialogService);

  openFromService() {
    this.alertDialog.open({
      title: "Delete Project?",
      description: "This will permanently delete the selected project. This action cannot be undone.",
      actionText: "Delete",
      variant: "destructive"
    });
  }

  get playgroundCode() {
    return `<!-- Template-driven -->
<tolle-alert-dialog>
  <tolle-alert-dialog-trigger>
    <tolle-button variant="outline">Open Dialog</tolle-button>
  </tolle-alert-dialog-trigger>
  ...
</tolle-alert-dialog>

<!-- Service-based (in your component.ts) -->
open() {
  this.alertDialog.open({
    title: "Are you sure?",
    description: "This is irreversible.",
    variant: "destructive"
  });
}`;
  }
}
