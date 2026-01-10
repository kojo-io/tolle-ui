import {Component, inject, OnInit} from '@angular/core';
import {BreadcrumbComponent} from '../../../../../tolle/src/lib/breadcrumb.component';
import {BreadcrumbItemComponent} from '../../../../../tolle/src/lib/breadcrumb-item.component';
import {BreadcrumbLinkComponent} from '../../../../../tolle/src/lib/breadcrumb-link.component';
import {BreadcrumbSeparatorComponent} from '../../../../../tolle/src/lib/breadcrumb-separator.component';
import {SegmentedComponent} from '../../../../../tolle/src/lib/segment.component';
import {BaseService} from '../../shared/base.service';
import {AnalyticsService} from '../../analytics.service';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {BaseEditorComponent} from '../../shared/base-editor/base-editor.component';

@Component({
  selector: 'app-breadcrumb-docs',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent,
    SegmentedComponent,
    FormsModule,
    NgIf,
    BaseEditorComponent,
  ],
  templateUrl: './breadcrumb-docs.component.html',
  styleUrl: './breadcrumb-docs.component.css'
})
export class BreadcrumbDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }
  selectedTab = "preview";
  basicTab = "preview";
  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  installation = "import {BreadcrumbComponent} from '@tolle_/tolle-ui';\n" +
    "import {BreadcrumbItemComponent} from '@tolle_/tolle-ui';\n" +
    "import {BreadcrumbLinkComponent} from '@tolle_/tolle-ui';\n" +
    "import {BreadcrumbSeparatorComponent} from '@tolle_/tolle-ui';\n" +
    "\n" +
    "\n" +
    "imports: [\n" +
    "    BreadcrumbComponent,\n" +
    "    BreadcrumbItemComponent,\n" +
    "    BreadcrumbLinkComponent,\n" +
    "    BreadcrumbSeparatorComponent\n" +
    "  ]";

  previewCode = "<tolle-breadcrumb>\n" +
    "  <tolle-breadcrumb-item>\n" +
    "    <tolle-breadcrumb-link>Home</tolle-breadcrumb-link>\n" +
    "  </tolle-breadcrumb-item>\n" +
    "  <tolle-breadcrumb-separator></tolle-breadcrumb-separator>\n" +
    "  <tolle-breadcrumb-item>\n" +
    "    <tolle-breadcrumb-link>Documents</tolle-breadcrumb-link>\n" +
    "  </tolle-breadcrumb-item>\n" +
    "  <tolle-breadcrumb-separator></tolle-breadcrumb-separator>\n" +
    "  <tolle-breadcrumb-item>\n" +
    "    <tolle-breadcrumb-link [active]=\"true\">Current Page</tolle-breadcrumb-link>\n" +
    "  </tolle-breadcrumb-item>\n" +
    "</tolle-breadcrumb>";

  componentViewOptions = [
    { label: 'component-override.css', value: 'component-override' },
    { label: 'override-example-tailwind.css', value: 'override-example-tailwind' }
  ];

  componentExampleOverride = "component-override";

  componentOverride = "/* \n" +
    "  BREADCRUMB COMPONENT OVERRIDES\n" +
    "  Leave these empty for custom styling\n" +
    "*/\n" +
    "\n" +
    "/* Breadcrumb Host Container */\n" +
    "tolle-breadcrumb {\n" +
    "  /* The main breadcrumb navigation container */\n" +
    "}\n" +
    "\n" +
    "/* Breadcrumb Navigation */\n" +
    "tolle-breadcrumb nav {\n" +
    "  /* The nav element containing the breadcrumb */\n" +
    "}\n" +
    "\n" +
    "/* Breadcrumb List */\n" +
    "tolle-breadcrumb ol {\n" +
    "  /* The ordered list containing breadcrumb items */\n" +
    "}\n" +
    "\n" +
    "/* Breadcrumb Item Container */\n" +
    "tolle-breadcrumb-item {\n" +
    "  /* Individual breadcrumb item host */\n" +
    "}\n" +
    "\n" +
    "/* Breadcrumb Item */\n" +
    "tolle-breadcrumb-item li {\n" +
    "  /* The list item for each breadcrumb */\n" +
    "}\n" +
    "\n" +
    "/* Breadcrumb Link Host */\n" +
    "tolle-breadcrumb-link {\n" +
    "  /* Breadcrumb link component host */\n" +
    "}\n" +
    "\n" +
    "/* Active Breadcrumb Link */\n" +
    "tolle-breadcrumb-link span[aria-current=\"page\"] {\n" +
    "  /* Active/current page breadcrumb link */\n" +
    "}\n" +
    "\n" +
    "/* Inactive Breadcrumb Link */\n" +
    "tolle-breadcrumb-link div {\n" +
    "  /* Clickable/inactive breadcrumb link */\n" +
    "}\n" +
    "\n" +
    "/* Breadcrumb Separator Host */\n" +
    "tolle-breadcrumb-separator {\n" +
    "  /* Separator component host */\n" +
    "}\n" +
    "\n" +
    "/* Breadcrumb Separator */\n" +
    "tolle-breadcrumb-separator li {\n" +
    "  /* Separator list item */\n" +
    "}\n" +
    "\n" +
    "/* Breadcrumb Separator Icon */\n" +
    "tolle-breadcrumb-separator i.ri-arrow-right-s-line {\n" +
    "  /* Default arrow separator icon */\n" +
    "}\n" +
    "\n" +
    ".dark {\n" +
    "\n" +
    "  /* Breadcrumb Host Container */\n" +
    "  tolle-breadcrumb {\n" +
    "    /* The main breadcrumb navigation container */\n" +
    "  }\n" +
    "\n" +
    "  /* Breadcrumb Navigation */\n" +
    "  tolle-breadcrumb nav {\n" +
    "    /* The nav element containing the breadcrumb */\n" +
    "  }\n" +
    "\n" +
    "  /* Breadcrumb List */\n" +
    "  tolle-breadcrumb ol {\n" +
    "    /* The ordered list containing breadcrumb items */\n" +
    "  }\n" +
    "\n" +
    "  /* Breadcrumb Item Container */\n" +
    "  tolle-breadcrumb-item {\n" +
    "    /* Individual breadcrumb item host */\n" +
    "  }\n" +
    "\n" +
    "  /* Breadcrumb Item */\n" +
    "  tolle-breadcrumb-item li {\n" +
    "    /* The list item for each breadcrumb */\n" +
    "  }\n" +
    "\n" +
    "  /* Breadcrumb Link Host */\n" +
    "  tolle-breadcrumb-link {\n" +
    "    /* Breadcrumb link component host */\n" +
    "  }\n" +
    "\n" +
    "  /* Active Breadcrumb Link */\n" +
    "  tolle-breadcrumb-link span[aria-current=\"page\"] {\n" +
    "    /* Active/current page breadcrumb link */\n" +
    "  }\n" +
    "\n" +
    "  /* Inactive Breadcrumb Link */\n" +
    "  tolle-breadcrumb-link div {\n" +
    "    /* Clickable/inactive breadcrumb link */\n" +
    "  }\n" +
    "\n" +
    "  /* Breadcrumb Separator Host */\n" +
    "  tolle-breadcrumb-separator {\n" +
    "    /* Separator component host */\n" +
    "  }\n" +
    "\n" +
    "  /* Breadcrumb Separator */\n" +
    "  tolle-breadcrumb-separator li {\n" +
    "    /* Separator list item */\n" +
    "  }\n" +
    "\n" +
    "  /* Breadcrumb Separator Icon */\n" +
    "  tolle-breadcrumb-separator i.ri-arrow-right-s-line {\n" +
    "    /* Default arrow separator icon */\n" +
    "  }\n" +
    "}";

  tailwindcss = "@tailwind base;\n" +
    "@tailwind components;\n" +
    "@tailwind utilities;\n" +
    "\n" +
    "/* Example: Custom breadcrumb styling */\n" +
    "tolle-breadcrumb nav {\n" +
    "  @apply font-sans;\n" +
    "}\n" +
    "\n" +
    "tolle-breadcrumb ol {\n" +
    "  @apply gap-2;\n" +
    "}\n" +
    "\n" +
    "tolle-breadcrumb-item li {\n" +
    "  @apply gap-2;\n" +
    "}\n" +
    "\n" +
    "tolle-breadcrumb-link span[aria-current=\"page\"] {\n" +
    "  @apply font-semibold text-blue-600;\n" +
    "}\n" +
    "\n" +
    "tolle-breadcrumb-link div {\n" +
    "  @apply hover:text-blue-500 transition-colors duration-200;\n" +
    "}\n" +
    "\n" +
    "tolle-breadcrumb-separator i.ri-arrow-right-s-line {\n" +
    "  @apply text-gray-400;\n" +
    "}"
}

