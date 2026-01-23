import { Component, inject, OnInit } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { NgIf } from '@angular/common';
import { SegmentedComponent } from '../../../../../tolle/src/lib/segment.component';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../../../../tolle/src/lib/alert.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { AnalyticsService } from '../../../../../showcase/src/app/analytics.service';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PlaygroundComponent } from '../../shared/playground/playground.component';
import { PropEntry } from '../../shared/types';
import { SourceCodeService } from '../../shared/source-code.service';
import { Observable } from 'rxjs';
import { SelectComponent } from '../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../tolle/src/lib/select-item.component';
import { SelectGroupComponent } from '../../../../../tolle/src/lib/select-group.component';
import { SelectSeparatorComponent } from '../../../../../tolle/src/lib/select-separator.component';
import { InputComponent } from '../../../../../tolle/src/lib/input.component';
import { CheckboxComponent } from '../../../../../tolle/src/lib/checkbox.component';

@Component({
  selector: 'app-alert-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    FormsModule,
    AlertComponent,
    PropTableComponent,
    PlaygroundComponent,
    SelectComponent,
    SelectItemComponent,
    InputComponent,
    CheckboxComponent
  ],
  templateUrl: './alert-docs.component.html',
  styleUrl: './alert-docs.component.css'
})
export class AlertDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);
  sourceService = inject(SourceCodeService);

  alertSource$!: Observable<string>;

  ngOnInit(): void {
    this.analytics.init();
    this.alertSource$ = this.sourceService.getFile('alert.component.ts');
  }

  // Playground State
  playgroundVariant: any = 'default';
  playgroundTitle = 'Heads up!';
  playgroundDismissible = true;

  get playgroundCode() {
    return `<tolle-alert 
  variant="${this.playgroundVariant}" 
  title="${this.playgroundTitle}" 
  [dismissible]="${this.playgroundDismissible}">
  <i icon class="ri-information-line"></i>
  You can add components to your app using the cli.
</tolle-alert>`;
  }

  alertProps: PropEntry[] = [
    { name: 'variant', type: "'default' | 'destructive' | 'success' | 'warning' | 'info'", default: "'default'", description: 'The visual style of the alert.' },
    { name: 'title', type: 'string', description: 'The title displayed at the top of the alert.' },
    { name: 'dismissible', type: 'boolean', default: 'false', description: 'Whether the alert can be dismissed by the user.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the container.' }
  ];

  alertOutputs: PropEntry[] = [
    { name: 'onClose', type: 'EventEmitter<void>', description: 'Fired when the alert is dismissed.' }
  ];

  selectedTab = "preview";
  basicTab = "preview";
  dismissTab = "preview";

  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  componentExampleOverride = "alert-component-override";

  componentViewOptions = [
    { label: 'alert-component-override.css', value: 'alert-component-override' },
    { label: 'override-example-tailwind.css', value: 'override-example-tailwind' }
  ];

  previewCode = `<div class="p-20 rounded-lg bg-background flex flex-col space-y-4">
  <tolle-alert title="Heads up!">
    <i icon class="ri-information-line"></i>
    You can add components to your app using the cli.
  </tolle-alert>

  <tolle-alert variant="destructive" title="Error">
    <i icon class="ri-error-warning-line"></i>
    Your session has expired. Please log in again.
  </tolle-alert>

  <tolle-alert variant="success" title="Success!">
    <i icon class="ri-checkbox-circle-line"></i>
    Your profile has been updated successfully.
  </tolle-alert>

  <tolle-alert
    variant="warning"
    title="System Maintenance"
    [dismissible]="true">
    <i icon class="ri-error-warning-line"></i>
    The server will be down for 5 minutes at midnight.
  </tolle-alert>
</div>`;

  installation = `import { AlertComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [AlertComponent]
})`;

  previewNoDismissCode = `<div class="p-20 rounded-lg bg-background flex flex-col space-y-4">
  <tolle-alert title="Heads up!">
    <i icon class="ri-information-line"></i>
    You can add components to your app using the cli.
  </tolle-alert>

  <tolle-alert variant="destructive" title="Error">
    <i icon class="ri-error-warning-line"></i>
    Your session has expired. Please log in again.
  </tolle-alert>

  <tolle-alert variant="success" title="Success!">
    <i icon class="ri-checkbox-circle-line"></i>
    Your profile has been updated successfully.
  </tolle-alert>
</div>`;

  previewDismissCode = `<tolle-alert
  variant="warning"
  title="System Maintenance"
  [dismissible]="true">
  <i icon class="ri-error-warning-line"></i>
  The server will be down for 5 minutes at midnight.
</tolle-alert>`;

  componentOverride = `/* 
  ALERT COMPONENT OVERRIDES
*/

tolle-alert > div {
  /* The alert container div */
}

/* Variant-specific overrides */
tolle-alert[variant="default"] > div { }
tolle-alert[variant="destructive"] > div { }
tolle-alert[variant="success"] > div { }
tolle-alert[variant="warning"] > div { }

tolle-alert i {
  /* Alert icon */
}

tolle-alert h5 {
  /* Alert title */
}

tolle-alert button {
  /* Dismiss button */
}`;

  componentExampleTailwindOverride = `/* Custom alert styling with Tailwind */
tolle-alert > div {
  @apply rounded-2xl shadow-lg backdrop-blur-sm;
}

tolle-alert[variant="destructive"] > div {
  @apply bg-red-50 border-red-300 text-red-900;
}

.dark tolle-alert[variant="destructive"] > div {
  @apply bg-red-900/20 border-red-700 text-red-200;
}`;
}
