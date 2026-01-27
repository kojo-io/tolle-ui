import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AlertDialogComponent,
    AlertDialogContentComponent,
    AlertDialogHeaderComponent,
    AlertDialogTitleComponent,
    AlertDialogDescriptionComponent,
    AlertDialogFooterComponent,
    AlertDialogCancelComponent,
    AlertDialogActionComponent
} from './alert-dialog.component';
import { ButtonComponent } from './button.component';
import { AlertDialogConfig, AlertDialogRef } from './alert-dialog.types';

@Component({
    selector: 'tolle-alert-dialog-dynamic',
    imports: [
        CommonModule,
        AlertDialogComponent,
        AlertDialogContentComponent,
        AlertDialogHeaderComponent,
        AlertDialogTitleComponent,
        AlertDialogDescriptionComponent,
        AlertDialogFooterComponent,
        AlertDialogCancelComponent,
        AlertDialogActionComponent,
        ButtonComponent
    ],
    template: `
    <tolle-alert-dialog [open]="true" (openChange)="onOpenChange($event)">
        <tolle-alert-dialog-content>
          <tolle-alert-dialog-header>
            <tolle-alert-dialog-title>{{ config.title }}</tolle-alert-dialog-title>
            <tolle-alert-dialog-description>
              {{ config.description }}
            </tolle-alert-dialog-description>
          </tolle-alert-dialog-header>
          <tolle-alert-dialog-footer>
            <tolle-alert-dialog-cancel (click)="close(false)">
              <tolle-button variant="outline">{{ config.cancelText || 'Cancel' }}</tolle-button>
            </tolle-alert-dialog-cancel>
            <tolle-alert-dialog-action (click)="close(true)">
              <tolle-button [variant]="config.variant === 'destructive' ? 'destructive' : 'default'">
                {{ config.actionText || 'Continue' }}
              </tolle-button>
            </tolle-alert-dialog-action>
          </tolle-alert-dialog-footer>
        </tolle-alert-dialog-content>
    </tolle-alert-dialog>
  `
})
export class AlertDialogDynamicComponent {
    config!: AlertDialogConfig;
    dialogRef!: AlertDialogRef;

    onOpenChange(open: boolean) {
        if (!open) {
            this.close(false);
        }
    }

    close(result: boolean) {
        this.dialogRef.close(result);
    }
}
