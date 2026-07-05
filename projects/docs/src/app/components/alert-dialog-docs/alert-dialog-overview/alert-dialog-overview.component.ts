import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
  selector: 'app-alert-dialog-overview',
  standalone: true,
  imports: [BaseEditorComponent, DocHeroComponent],
  template: `
    <app-doc-hero slug="alert-dialog" description="A modal dialog that interrupts the user with important content and expects a response." id="overview" />

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight" id="installation">Installation</h2>
      <div class="overflow-hidden rounded-lg border border-border">
        <app-base-editor [code]="installationCode" language="typescript" />
      </div>
    </section>

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight" id="service-usage">Service Usage</h2>
      <p class="mb-4 text-muted-foreground">You can also trigger the Alert Dialog programmatically using the <code class="text-primary">AlertDialogService</code>.</p>
      <div class="overflow-hidden rounded-lg border border-border">
        <app-base-editor [code]="serviceUsageCode" language="typescript" />
      </div>
    </section>
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
