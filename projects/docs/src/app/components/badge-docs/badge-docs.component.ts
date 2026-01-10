import {Component, inject, OnInit} from '@angular/core';
import {BaseEditorComponent} from "../../shared/base-editor/base-editor.component";
import {NgIf} from "@angular/common";
import {SegmentedComponent} from "../../../../../tolle/src/lib/segment.component";
import {BaseService} from '../../shared/base.service';
import {FormsModule} from '@angular/forms';
import {BadgeComponent} from '../../../../../tolle/src/lib/badge.component';
import {AnalyticsService} from '../../../../../showcase/src/app/analytics.service';

@Component({
  selector: 'app-badge-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    NgIf,
    SegmentedComponent,
    FormsModule,
    BadgeComponent
  ],
  templateUrl: './badge-docs.component.html',
  styleUrl: './badge-docs.component.css'
})
export class BadgeDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }

  selectedTab = "preview";
  singleUsage = "preview";

  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  componentViewOptions = [
    { label: 'component-override.css', value: 'component-override' },
    { label: 'override-example-tailwind.css', value: 'override-example-tailwind' }
  ];

  componentExampleOverride = "component-override";

  installation = "import {BadgeComponent} from '@tolle_/tolle-ui';\n" +
    "\n" +
    "\n" +
    "imports: [\n" +
    "    BadgeComponent,\n" +
    "  ]";

  badgeComponent = "<div class=\"py-4\">\n" +
    "  <div class=\"flex flex-wrap gap-4 items-center\">\n" +
    "    <tolle-badge>Active</tolle-badge>\n" +
    "    <tolle-badge variant=\"secondary\">Draft</tolle-badge>\n" +
    "    <tolle-badge variant=\"outline\">Archived</tolle-badge>\n" +
    "    <tolle-badge variant=\"destructive\">Error</tolle-badge>\n" +
    "    <tolle-badge size=\"xs\">XS Tag</tolle-badge>\n" +
    "    <tolle-badge size=\"sm\">SM Tag</tolle-badge>\n" +
    "    <tolle-badge size=\"default\">Default Tag</tolle-badge>\n" +
    "  </div>\n" +
    "  <div class=\"flex items-center gap-2 mt-2\">\n" +
    "    <span class=\"text-sm font-medium block\">Notifications</span>\n" +
    "    <tolle-badge variant=\"destructive\" size=\"xs\" class=\"rounded-full\">99+</tolle-badge>\n" +
    "  </div>\n" +
    "  <div class=\"flex flex-wrap gap-2 mt-2\">\n" +
    "    <tolle-badge variant=\"secondary\">\n" +
    "      <i prefix class=\"ri-price-tag-3-line\"></i>\n" +
    "      Ecommerce\n" +
    "    </tolle-badge>\n" +
    "\n" +
    "    <tolle-badge\n" +
    "      variant=\"outline\"\n" +
    "      [removable]=\"true\">\n" +
    "      Design\n" +
    "    </tolle-badge>\n" +
    "\n" +
    "    <tolle-badge [removable]=\"true\">\n" +
    "      Verified\n" +
    "    </tolle-badge>\n" +
    "  </div>\n" +
    "</div>";

  badgeOverride = "/* \n" +
    "  BADGE COMPONENT OVERRIDES\n" +
    "  Leave these empty for custom styling\n" +
    "*/\n" +
    "\n" +
    "/* Host Element (tolle-badge) */\n" +
    "tolle-badge {\n" +
    "  /* The component host element */\n" +
    "}\n" +
    "\n" +
    "/* Main Badge Container */\n" +
    "tolle-badge > div {\n" +
    "  /* The main container div with flex layout and base styles */\n" +
    "}\n" +
    "\n" +
    "/* Content Area */\n" +
    "tolle-badge span.truncate {\n" +
    "  /* Text content area with truncation */\n" +
    "}\n" +
    "\n" +
    "/* Remove Button */\n" +
    "tolle-badge button {\n" +
    "  /* Remove/X button (only when removable=true) */\n" +
    "}\n" +
    "\n" +
    "/* Remove Button Icon */\n" +
    "tolle-badge button i.ri-close-line {\n" +
    "  /* Close/X icon inside the remove button */\n" +
    "}\n" +
    "\n" +
    "/* Variant: Default */\n" +
    "tolle-badge > div.bg-primary {\n" +
    "  /* Primary variant background and text colors */\n" +
    "}\n" +
    "\n" +
    "/* Variant: Secondary */\n" +
    "tolle-badge > div.bg-secondary {\n" +
    "  /* Secondary variant background and text colors */\n" +
    "}\n" +
    "\n" +
    "/* Variant: Outline */\n" +
    "tolle-badge > div.bg-transparent {\n" +
    "  /* Outline variant border and background styles */\n" +
    "}\n" +
    "\n" +
    "/* Variant: Destructive */\n" +
    "tolle-badge > div.bg-destructive {\n" +
    "  /* Destructive variant background and text colors */\n" +
    "}\n" +
    "\n" +
    "/* Size: XS */\n" +
    "tolle-badge > div.text-\\[10px\\] {\n" +
    "  /* Extra small size padding and font size */\n" +
    "}\n" +
    "\n" +
    "/* Size: SM */\n" +
    "tolle-badge > div.text-\\[11px\\] {\n" +
    "  /* Small size padding and font size */\n" +
    "}\n" +
    "\n" +
    "/* Size: Default */\n" +
    "tolle-badge > div.text-xs {\n" +
    "  /* Default size font size */\n" +
    "}\n" +
    "\n" +
    ".dark {\n" +
    "  /* \n" +
    "  BADGE COMPONENT OVERRIDES\n" +
    "  Leave these empty for custom styling\n" +
    "*/\n" +
    "\n" +
    "  /* Host Element (tolle-badge) */\n" +
    "  tolle-badge {\n" +
    "    /* The component host element */\n" +
    "  }\n" +
    "\n" +
    "  /* Main Badge Container */\n" +
    "  tolle-badge > div {\n" +
    "    /* The main container div with flex layout and base styles */\n" +
    "  }\n" +
    "\n" +
    "  /* Content Area */\n" +
    "  tolle-badge span.truncate {\n" +
    "    /* Text content area with truncation */\n" +
    "  }\n" +
    "\n" +
    "  /* Remove Button */\n" +
    "  tolle-badge button {\n" +
    "    /* Remove/X button (only when removable=true) */\n" +
    "  }\n" +
    "\n" +
    "  /* Remove Button Icon */\n" +
    "  tolle-badge button i.ri-close-line {\n" +
    "    /* Close/X icon inside the remove button */\n" +
    "  }\n" +
    "\n" +
    "  /* Variant: Default */\n" +
    "  tolle-badge > div.bg-primary {\n" +
    "    /* Primary variant background and text colors */\n" +
    "  }\n" +
    "\n" +
    "  /* Variant: Secondary */\n" +
    "  tolle-badge > div.bg-secondary {\n" +
    "    /* Secondary variant background and text colors */\n" +
    "  }\n" +
    "\n" +
    "  /* Variant: Outline */\n" +
    "  tolle-badge > div.bg-transparent {\n" +
    "    /* Outline variant border and background styles */\n" +
    "  }\n" +
    "\n" +
    "  /* Variant: Destructive */\n" +
    "  tolle-badge > div.bg-destructive {\n" +
    "    /* Destructive variant background and text colors */\n" +
    "  }\n" +
    "\n" +
    "  /* Size: XS */\n" +
    "  tolle-badge > div.text-\\[10px\\] {\n" +
    "    /* Extra small size padding and font size */\n" +
    "  }\n" +
    "\n" +
    "  /* Size: SM */\n" +
    "  tolle-badge > div.text-\\[11px\\] {\n" +
    "    /* Small size padding and font size */\n" +
    "  }\n" +
    "\n" +
    "  /* Size: Default */\n" +
    "  tolle-badge > div.text-xs {\n" +
    "    /* Default size font size */\n" +
    "  }\n" +
    "}";

  tailwindOverride = "@tailwind base;\n" +
    "@tailwind components;\n" +
    "@tailwind utilities;\n" +
    "\n" +
    "/* Example: Custom badge styling */\n" +
    "tolle-badge > div {\n" +
    "  @apply rounded-full shadow-md;\n" +
    "}\n" +
    "\n" +
    "tolle-badge > div.bg-primary {\n" +
    "  @apply bg-gradient-to-r from-blue-500 to-purple-600 text-white;\n" +
    "}\n" +
    "\n" +
    "tolle-badge button {\n" +
    "  @apply hover:bg-red-500 hover:text-white transition-colors;\n" +
    "}\n" +
    "\n" +
    "tolle-badge button i.ri-close-line {\n" +
    "  @apply text-sm;\n" +
    "}\n" +
    "\n" +
    "tolle-badge > div.text-\\[10px\\] {\n" +
    "  @apply px-1.5 py-0 text-[9px] font-bold;\n" +
    "}"
}
