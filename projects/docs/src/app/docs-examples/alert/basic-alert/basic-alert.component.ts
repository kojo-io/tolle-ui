import { Component } from '@angular/core';
import { AlertComponent } from '../../../../../../tolle/src/lib/alert.component';

@Component({
  selector: 'app-basic-alert',
  imports: [AlertComponent],
  template: `
    <div class="grid w-full max-w-xl gap-4">
      <tolle-alert title="Heads up!">
        <i icon class="ri-information-line"></i>
        You can add components to your app using the CLI.
      </tolle-alert>

      <tolle-alert variant="destructive" title="Payment failed">
        <i icon class="ri-error-warning-line"></i>
        Your card was declined. Update your billing details and try again.
      </tolle-alert>

      @if (showNotice) {
        <tolle-alert title="Saved" [dismissible]="true" (onClose)="showNotice = false">
          <i icon class="ri-checkbox-circle-line"></i>
          Your changes are live.
        </tolle-alert>
      }
    </div>
  `,
})
export class BasicAlertComponent {
  showNotice = true;
}
