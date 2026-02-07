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
  standalone: true,
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
          <tolle-alert-dialog #templateDialog>
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
                  <tolle-alert-dialog-cancel (click)="templateDialog.open = false">
                    <tolle-button variant="outline">Cancel</tolle-button>
                  </tolle-alert-dialog-cancel>
                  <tolle-alert-dialog-action (click)="templateDialog.open = false">
                    <tolle-button>Continue</tolle-button>
                  </tolle-alert-dialog-action>
                </tolle-alert-dialog-footer>
              </tolle-alert-dialog-content>
            </tolle-alert-dialog-portal>
          </tolle-alert-dialog>

          <div class="flex flex-wrap gap-2">
            <tolle-button (click)="openFromService('xs')">Size: XS</tolle-button>
            <tolle-button (click)="openFromService('sm')">Size: SM</tolle-button>
            <tolle-button (click)="openFromService('md')">Size: MD</tolle-button>
            <tolle-button (click)="openFromService('lg')">Size: LG</tolle-button>
            <tolle-button (click)="openFromService('xl')">Size: XL</tolle-button>
            <tolle-button (click)="openFromService('2xl')">Size: 2XL</tolle-button>
            <tolle-button (click)="openFromService('full')">Size: Full</tolle-button>
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class AlertDialogInteractiveComponent {
  private alertDialog = inject(AlertDialogService);

  openFromService(size: any = 'lg') {
    const dialog = this.alertDialog.open({
      title: "Delete Project?",
      description: "This will permanently delete the selected project. This action cannot be undone.",
      actionText: "Delete",
      variant: "destructive",
      size: size
    });

    dialog.afterClosed$.subscribe({
      next: (result) => {
        alert(result);
      }
    })
  }

  get playgroundCode() {
    return `<!-- Template-driven -->
<tolle-alert-dialog #dialog>
  <tolle-alert-dialog-trigger>
    <tolle-button variant="outline">Open Dialog</tolle-button>
  </tolle-alert-dialog-trigger>
  
  <tolle-alert-dialog-portal>
    <tolle-alert-dialog-content>
      <tolle-alert-dialog-header>
        <tolle-alert-dialog-title>Are you sure?</tolle-alert-dialog-title>
      </tolle-alert-dialog-header>
      <tolle-alert-dialog-footer>
        <tolle-alert-dialog-cancel (click)="dialog.open = false">
          <button>Cancel</button>
        </tolle-alert-dialog-cancel>
        <tolle-alert-dialog-action (click)="dialog.open = false">
          <button>Continue</button>
        </tolle-alert-dialog-action>
      </tolle-alert-dialog-footer>
    </tolle-alert-dialog-content>
  </tolle-alert-dialog-portal>
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
