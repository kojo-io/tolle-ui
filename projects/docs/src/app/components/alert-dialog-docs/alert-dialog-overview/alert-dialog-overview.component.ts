import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
  selector: 'app-alert-dialog-overview',
  standalone: true,
  imports: [BaseEditorComponent],
  template: `
    <header class="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8" id="overview">
      <h1 class="text-4xl font-extrabold tracking-tight mb-4 text-foreground">Alert Dialog</h1>
      <p class="text-lg text-muted-foreground mb-6">
        A modal dialog that interrupts the user with important content and expects a response.
      </p>

      <section class="mt-8">
        <h2 class="text-xl font-bold mb-4 text-foreground" id="installation">Installation</h2>
        <div class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <app-base-editor [code]="installationCode" language="typescript" />
        </div>
      </section>

      <section class="mt-8">
        <h2 class="text-xl font-bold mb-4 text-foreground" id="service-usage">Service Usage</h2>
        <p class="text-muted-foreground mb-4">You can also trigger the Alert Dialog programmatically using the <code class="text-primary">AlertDialogService</code>.</p>
        <div class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <app-base-editor [code]="serviceUsageCode" language="typescript" />
        </div>
      </section>
    </header>
  `
})
export class AlertDialogOverviewComponent {
  installationCode = `import { 
  AlertDialogComponent, 
  ...
  AlertDialogService
} from '@tolle_/tolle-ui';

imports: [
  AlertDialogComponent,
  ...
]`;

  usageCode = `<tolle-alert-dialog>
  <tolle-alert-dialog-trigger>
    <button>Open Dialog</button>
  </tolle-alert-dialog-trigger>
  ...
</tolle-alert-dialog>`;

  serviceUsageCode = `import { AlertDialogService } from '@tolle_/tolle-ui';

export class MyComponent {
  private alertDialog = inject(AlertDialogService);

  openDialog() {
    const dialogRef = this.alertDialog.open({
      title: "Are you absolutely sure?",
      description: "This action cannot be undone.",
      actionText: "Delete Account",
      variant: "destructive"
    });

    dialogRef.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        // Handle confirmation
      }
    });
  }
}`;
}
