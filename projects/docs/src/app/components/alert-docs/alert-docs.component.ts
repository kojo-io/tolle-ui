import {Component, inject} from '@angular/core';
import {BaseService} from '../../shared/base.service';
import {NgIf} from '@angular/common';
import {SegmentedComponent} from '../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {AlertComponent} from '../../../../../tolle/src/lib/alert.component';
import {BaseEditorComponent} from '../../shared/base-editor/base-editor.component';

@Component({
  selector: 'app-alert-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    NgIf,
    SegmentedComponent,
    FormsModule,
    AlertComponent,
  ],
  templateUrl: './alert-docs.component.html',
  styleUrl: './alert-docs.component.css'
})
export class AlertDocsComponent {
  baseService = inject(BaseService);
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

  previewCode = "<div class=\"p-20 rounded-lg bg-background flex flex-col space-y-4\">\n" +
    "  <tolle-alert title=\"Heads up!\">\n" +
    "    <i icon class=\"ri-information-line\"></i>\n" +
    "    You can add components to your app using the cli.\n" +
    "  </tolle-alert>\n\n" +
    "  <tolle-alert variant=\"destructive\" title=\"Error\">\n" +
    "    <i icon class=\"ri-error-warning-line\"></i>\n" +
    "    Your session has expired. Please log in again.\n" +
    "  </tolle-alert>\n\n" +
    "  <tolle-alert variant=\"success\" title=\"Success!\">\n" +
    "    <i icon class=\"ri-checkbox-circle-line\"></i>\n" +
    "    Your profile has been updated successfully.\n" +
    "  </tolle-alert>\n\n" +
    "  <tolle-alert\n" +
    "    variant=\"warning\"\n" +
    "    title=\"System Maintenance\"\n" +
    "    [dismissible]=\"true\">\n" +
    "    <i icon class=\"ri-error-warning-line\"></i>\n" +
    "    The server will be down for 5 minutes at midnight.\n" +
    "  </tolle-alert>\n" +
    "</div>";

  installation = "import {AlertComponent} from '@tolle_/tolle-ui';\n" +
    "\n" +
    "\n" +
    "imports: [\n" +
    "    AlertComponent,\n" +
    "  ]";


  previewNoDismissCode = "<div class=\"p-20 rounded-lg bg-background flex flex-col space-y-4\">\n" +
    "  <tolle-alert title=\"Heads up!\">\n" +
    "    <i icon class=\"ri-information-line\"></i>\n" +
    "    You can add components to your app using the cli.\n" +
    "  </tolle-alert>\n\n" +
    "  <tolle-alert variant=\"destructive\" title=\"Error\">\n" +
    "    <i icon class=\"ri-error-warning-line\"></i>\n" +
    "    Your session has expired. Please log in again.\n" +
    "  </tolle-alert>\n\n" +
    "  <tolle-alert variant=\"success\" title=\"Success!\">\n" +
    "    <i icon class=\"ri-checkbox-circle-line\"></i>\n" +
    "    Your profile has been updated successfully.\n" +
    "  </tolle-alert>\n" +
    "</div>";

  previewDismissCode = "<div class=\"p-20 rounded-lg bg-background flex flex-col space-y-4\">\n" +
    "  <tolle-alert\n" +
    "    variant=\"warning\"\n" +
    "    title=\"System Maintenance\"\n" +
    "    [dismissible]=\"true\">\n" +
    "    <i icon class=\"ri-error-warning-line\"></i>\n" +
    "    The server will be down for 5 minutes at midnight.\n" +
    "  </tolle-alert>\n" +
    "</div>";

  componentOverride = "/* \n" +
    "  ALERT COMPONENT OVERRIDES\n" +
    "  Leave these empty for custom styling\n" +
    "*/\n" +
    "\n" +
    "/* Main Alert Container */\n" +
    "tolle-alert > div {\n" +
    "  /* The alert container div */\n" +
    "}\n" +
    "\n" +
    "/* Variant-specific overrides */\n" +
    "tolle-alert[variant=\"default\"] > div {\n" +
    "  /* Default variant styling */\n" +
    "}\n" +
    "\n" +
    "tolle-alert[variant=\"destructive\"] > div {\n" +
    "  /* Destructive variant styling */\n" +
    "}\n" +
    "\n" +
    "tolle-alert[variant=\"success\"] > div {\n" +
    "  /* Success variant styling */\n" +
    "}\n" +
    "\n" +
    "tolle-alert[variant=\"warning\"] > div {\n" +
    "  /* Warning variant styling */\n" +
    "}\n" +
    "\n" +
    "/* Alert Icon */\n" +
    "tolle-alert i {\n" +
    "  /* Alert icon (from icon slot) */\n" +
    "}\n" +
    "\n" +
    "/* Alert Title */\n" +
    "tolle-alert h5 {\n" +
    "  /* Alert title element */\n" +
    "}\n" +
    "\n" +
    "/* Alert Content */\n" +
    "tolle-alert > div > div:last-child {\n" +
    "  /* Content wrapper div */\n" +
    "}\n" +
    "\n" +
    "/* Alert Text */\n" +
    "tolle-alert .text-sm {\n" +
    "  /* Main text content */\n" +
    "}\n" +
    "\n" +
    "/* Alert Paragraphs */\n" +
    "tolle-alert p {\n" +
    "  /* Paragraphs inside alert */\n" +
    "}\n" +
    "\n" +
    "/* Dismiss Button */\n" +
    "tolle-alert button {\n" +
    "  /* Dismiss button */\n" +
    "}\n" +
    "\n" +
    "/* Dismiss Button Icon */\n" +
    "tolle-alert button i {\n" +
    "  /* Close icon inside dismiss button */\n" +
    "}\n" +
    "\n" +
    "/* Hover States */\n" +
    "tolle-alert button:hover {\n" +
    "  /* Dismiss button hover */\n" +
    "}\n" +
    "\n" +
    "tolle-alert button:hover i {\n" +
    "  /* Dismiss icon hover */\n" +
    "}\n" +
    "\n" +
    "/* Animation States */\n" +
    "tolle-alert .opacity-0 {\n" +
    "  /* Fading out state */\n" +
    "}\n" +
    "\n" +
    "tolle-alert .scale-95 {\n" +
    "  /* Scaling down state */\n" +
    "}\n" +
    "\n" +
    ".dark {\n" +
    "  /* \n" +
    "  ALERT COMPONENT OVERRIDES\n" +
    "  Leave these empty for custom styling\n" +
    "*/\n" +
    "\n" +
    "  /* Main Alert Container */\n" +
    "  tolle-alert > div {\n" +
    "    /* The alert container div */\n" +
    "  }\n" +
    "\n" +
    "  /* Variant-specific overrides */\n" +
    "  tolle-alert[variant=\"default\"] > div {\n" +
    "    /* Default variant styling */\n" +
    "  }\n" +
    "\n" +
    "  tolle-alert[variant=\"destructive\"] > div {\n" +
    "    /* Destructive variant styling */\n" +
    "  }\n" +
    "\n" +
    "  tolle-alert[variant=\"success\"] > div {\n" +
    "    /* Success variant styling */\n" +
    "  }\n" +
    "\n" +
    "  tolle-alert[variant=\"warning\"] > div {\n" +
    "    /* Warning variant styling */\n" +
    "  }\n" +
    "\n" +
    "  /* Alert Icon */\n" +
    "  tolle-alert i {\n" +
    "    /* Alert icon (from icon slot) */\n" +
    "  }\n" +
    "\n" +
    "  /* Alert Title */\n" +
    "  tolle-alert h5 {\n" +
    "    /* Alert title element */\n" +
    "  }\n" +
    "\n" +
    "  /* Alert Content */\n" +
    "  tolle-alert > div > div:last-child {\n" +
    "    /* Content wrapper div */\n" +
    "  }\n" +
    "\n" +
    "  /* Alert Text */\n" +
    "  tolle-alert .text-sm {\n" +
    "    /* Main text content */\n" +
    "  }\n" +
    "\n" +
    "  /* Alert Paragraphs */\n" +
    "  tolle-alert p {\n" +
    "    /* Paragraphs inside alert */\n" +
    "  }\n" +
    "\n" +
    "  /* Dismiss Button */\n" +
    "  tolle-alert button {\n" +
    "    /* Dismiss button */\n" +
    "  }\n" +
    "\n" +
    "  /* Dismiss Button Icon */\n" +
    "  tolle-alert button i {\n" +
    "    /* Close icon inside dismiss button */\n" +
    "  }\n" +
    "\n" +
    "  /* Hover States */\n" +
    "  tolle-alert button:hover {\n" +
    "    /* Dismiss button hover */\n" +
    "  }\n" +
    "\n" +
    "  tolle-alert button:hover i {\n" +
    "    /* Dismiss icon hover */\n" +
    "  }\n" +
    "\n" +
    "  /* Animation States */\n" +
    "  tolle-alert .opacity-0 {\n" +
    "    /* Fading out state */\n" +
    "  }\n" +
    "\n" +
    "  tolle-alert .scale-95 {\n" +
    "    /* Scaling down state */\n" +
    "  }\n" +
    "}";

  componentExampleTailwindOverride = "\n" +
    "@tailwind base;\n" +
    "@tailwind components;\n" +
    "@tailwind utilities;\n" +
    "/* Custom alert styling */\n" +
    "tolle-alert > div {\n" +
    "  @apply rounded-2xl shadow-lg backdrop-blur-sm;\n" +
    "}\n" +
    "\n" +
    "/* Destructive variant enhancements */\n" +
    "tolle-alert[variant=\"destructive\"] > div {\n" +
    "  @apply bg-red-50 border-red-300 text-red-900;\n" +
    "}\n" +
    "\n" +
    "tolle-alert[variant=\"destructive\"] i {\n" +
    "  @apply text-red-500;\n" +
    "}\n" +
    "\n" +
    "/* Success variant enhancements */\n" +
    "tolle-alert[variant=\"success\"] > div {\n" +
    "  @apply bg-emerald-50 border-emerald-300 text-emerald-900;\n" +
    "}\n" +
    "\n" +
    "tolle-alert[variant=\"success\"] h5 {\n" +
    "  @apply font-bold text-emerald-800;\n" +
    "}\n" +
    "\n" +
    "/* Warning variant enhancements */\n" +
    "tolle-alert[variant=\"warning\"] > div {\n" +
    "  @apply bg-amber-50 border-amber-300 text-amber-900;\n" +
    "}\n" +
    "\n" +
    "tolle-alert[variant=\"warning\"] .text-sm {\n" +
    "  @apply font-medium;\n" +
    "}\n" +
    "\n" +
    "/* Dismiss button styling */\n" +
    "tolle-alert button {\n" +
    "  @apply hover:bg-neutral-100 hover:text-neutral-900 rounded-full w-8 h-8 flex items-center justify-center;\n" +
    "}\n" +
    "\n" +
    "tolle-alert button i {\n" +
    "  @apply text-base;\n" +
    "}\n" +
    "\n" +
    "/* Dark mode overrides */\n" +
    ".dark tolle-alert[variant=\"destructive\"] > div {\n" +
    "  @apply bg-red-900/20 border-red-700 text-red-200;\n" +
    "}\n" +
    "\n" +
    ".dark tolle-alert[variant=\"success\"] > div {\n" +
    "  @apply bg-emerald-900/20 border-emerald-700 text-emerald-200;\n" +
    "}\n" +
    "\n" +
    ".dark tolle-alert button {\n" +
    "  @apply hover:bg-neutral-800 hover:text-white;\n" +
    "}\n" +
    "\n" +
    "/* Custom animation for dismissal */\n" +
    "tolle-alert .opacity-0 {\n" +
    "  @apply transition-opacity duration-300;\n" +
    "}\n" +
    "\n" +
    "tolle-alert .scale-95 {\n" +
    "  @apply transition-transform duration-300;\n" +
    "}"
}
