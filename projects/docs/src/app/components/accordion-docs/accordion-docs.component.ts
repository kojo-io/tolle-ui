import {Component, inject, OnInit} from '@angular/core';
import {BaseService} from '../../shared/base.service';
import {BaseEditorComponent} from '../../shared/base-editor/base-editor.component';
import {SegmentedComponent} from '../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AccordionItemComponent} from '../../../../../tolle/src/lib/accordion-item.component';
import {AccordionComponent} from '../../../../../tolle/src/lib/accordion.component';
import {AnalyticsService} from '../../../../../showcase/src/app/analytics.service';

@Component({
  selector: 'app-accordion-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    SegmentedComponent,
    FormsModule,
    NgIf,
    AccordionComponent,
    AccordionItemComponent,
  ],
  templateUrl: './accordion-docs.component.html',
  styleUrl: './accordion-docs.component.css'
})
export class AccordionDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }
  selectedTab = "preview";
  singleUsage = "preview";
  multiUsage = "preview";

  componentExampleOverride = "accordion-component-override";

  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  componentViewOptions = [
    { label: 'accordion-component-override.css', value: 'accordion-component-override' },
    { label: 'override-example.css', value: 'override-example' },
    { label: 'override-example-tailwind.css', value: 'override-example-tailwind' }
  ];

  componentItemExampleOverride = "accordion-item-component-override";
  componentItemViewOptions = [
    { label: 'accordion-item-component-override.css', value: 'accordion-item-component-override' },
    { label: 'override-example.css', value: 'override-example' },
    { label: 'override-example-tailwind.css', value: 'override-example-tailwind' }
  ];


  accordionBasic = "<tolle-accordion>\n" +
    "  <tolle-accordion-item title=\"Can I open many at once?\">\n" +
    "    Yes, because the type is set to multiple.\n" +
    "  </tolle-accordion-item>\n" +
    "  <tolle-accordion-item title=\"Is it animated?\">\n" +
    "    No, it uses static rendering for a snappy, high-performance feel.\n" +
    "  </tolle-accordion-item>\n" +
    "</tolle-accordion>";

  installation = "import {AccordionItemComponent} from '@tolle_/tolle-ui';\n" +
    "import {AccordionComponent} from '@tolle_/tolle-ui';\n" +
    "\n" +
    "\n" +
    "imports: [\n" +
    "    AccordionComponent,\n" +
    "    AccordionItemComponent,\n" +
    "  ]";

  accordionMultiple = "<tolle-accordion type='multiple'>\n" +
    "  <tolle-accordion-item title=\"Can I open many at once?\">\n" +
    "    Yes, because the type is set to multiple.\n" +
    "  </tolle-accordion-item>\n" +
    "  <tolle-accordion-item title=\"Is it animated?\">\n" +
    "    No, it uses static rendering for a snappy, high-performance feel.\n" +
    "  </tolle-accordion-item>\n" +
    "</tolle-accordion>";

  componentOverride = "/*\n" +
    "  ACCORDION COMPONENT OVERRIDES\n" +
    "  Leave these empty for custom styling\n" +
    "*/\n" +
    "\n" +
    "/* Main Accordion Container */\n" +
    "tolle-accordion {\n" +
    "  /* The host component wrapper */\n" +
    "}\n" +
    "\n" +
    "/* Inner Container Div */\n" +
    "tolle-accordion > div {\n" +
    "  /* The div wrapping ng-content */\n" +
    "}\n" +
    "\n" +
    "/* Content wrapper */\n" +
    "tolle-accordion .w-full {\n" +
    "  /* Full width wrapper */\n" +
    "}\n" +
    "\n" +
    "/* All accordion items inside */\n" +
    "tolle-accordion tolle-accordion-item {\n" +
    "  /* All child accordion items */\n" +
    "}\n" +
    "\n" +
    "/* Specific accordion items */\n" +
    "tolle-accordion tolle-accordion-item:first-child {\n" +
    "  /* First accordion item */\n" +
    "}\n" +
    "\n" +
    "tolle-accordion tolle-accordion-item:last-child {\n" +
    "  /* Last accordion item */\n" +
    "}\n" +
    "\n" +
    "/* Accordion items in single mode */\n" +
    "tolle-accordion[type=\"single\"] tolle-accordion-item {\n" +
    "  /* Items in single mode (only one open) */\n" +
    "}\n" +
    "\n" +
    "/* Accordion items in multiple mode */\n" +
    "tolle-accordion[type=\"multiple\"] tolle-accordion-item {\n" +
    "  /* Items in multiple mode (multiple can be open) */\n" +
    "}\n" +
    "\n" +
    ".dark {\n" +
    "  /* Main Accordion Container */\n" +
    "  tolle-accordion {\n" +
    "    /* The host component wrapper */\n" +
    "  }\n" +
    "\n" +
    "  /* Inner Container Div */\n" +
    "  tolle-accordion > div {\n" +
    "    /* The div wrapping ng-content */\n" +
    "  }\n" +
    "\n" +
    "  /* Content wrapper */\n" +
    "  tolle-accordion .w-full {\n" +
    "    /* Full width wrapper */\n" +
    "  }\n" +
    "\n" +
    "  /* All accordion items inside */\n" +
    "  tolle-accordion tolle-accordion-item {\n" +
    "    /* All child accordion items */\n" +
    "  }\n" +
    "\n" +
    "  /* Specific accordion items */\n" +
    "  tolle-accordion tolle-accordion-item:first-child {\n" +
    "    /* First accordion item */\n" +
    "  }\n" +
    "\n" +
    "  tolle-accordion tolle-accordion-item:last-child {\n" +
    "    /* Last accordion item */\n" +
    "  }\n" +
    "\n" +
    "  /* Accordion items in single mode */\n" +
    "  tolle-accordion[type=\"single\"] tolle-accordion-item {\n" +
    "    /* Items in single mode (only one open) */\n" +
    "  }\n" +
    "\n" +
    "  /* Accordion items in multiple mode */\n" +
    "  tolle-accordion[type=\"multiple\"] tolle-accordion-item {\n" +
    "    /* Items in multiple mode (multiple can be open) */\n" +
    "  }\n" +
    "}\n";

  componentOverrideExample = "/* Change accordion container */\n" +
    "tolle-accordion {\n" +
    "  display: block;\n" +
    "  width: 100%;\n" +
    "}\n" +
    "\n" +
    "tolle-accordion > div {\n" +
    "  background: white;\n" +
    "  border-radius: 12px;\n" +
    "  padding: 16px;\n" +
    "  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n" +
    "}\n" +
    "\n" +
    "/* Add spacing between items */\n" +
    "tolle-accordion tolle-accordion-item {\n" +
    "  margin-bottom: 8px;\n" +
    "}\n" +
    "\n" +
    "tolle-accordion tolle-accordion-item:last-child {\n" +
    "  margin-bottom: 0;\n" +
    "}\n" +
    "\n" +
    "/* Style for single mode */\n" +
    "tolle-accordion[type=\"single\"] tolle-accordion-item > div {\n" +
    "  border: 2px solid #e5e7eb;\n" +
    "}\n" +
    "\n" +
    "/* Style for multiple mode */\n" +
    "tolle-accordion[type=\"multiple\"] tolle-accordion-item > div {\n" +
    "  border: 1px solid #d1d5db;\n" +
    "}\n" +
    "\n" +
    "/* Style first and last items differently */\n" +
    "tolle-accordion tolle-accordion-item:first-child > div {\n" +
    "  border-top-left-radius: 12px;\n" +
    "  border-top-right-radius: 12px;\n" +
    "}\n" +
    "\n" +
    "tolle-accordion tolle-accordion-item:last-child > div {\n" +
    "  border-bottom-left-radius: 12px;\n" +
    "  border-bottom-right-radius: 12px;\n" +
    "  border-bottom: none;\n" +
    "}\n" +
    "\n" +
    "/* Dark mode overrides */\n" +
    ".dark {\n" +
    "  tolle-accordion > div {\n" +
    "    background: #1f2937;\n" +
    "    border: 1px solid #374151;\n" +
    "  } \n" +
    "  tolle-accordion[type=\"single\"] tolle-accordion-item > div {\n" +
    "    border-color: #4b5563;\n" +
    "  }\n" +
    "\n" +
    "  tolle-accordion[type=\"multiple\"] tolle-accordion-item > div {\n" +
    "    border-color: #6b7280;\n" +
    "  }\n" +
    "}";

  componentOverrideExampleUsingTailwind = "@tailwind base;\n" +
    "@tailwind components;\n" +
    "@tailwind utilities;\n" +
    "\n" +
    "/* Base accordion container */\n" +
    "tolle-accordion {\n" +
    "  @apply block w-full;\n" +
    "}\n" +
    "\n" +
    "tolle-accordion > div {\n" +
    "  @apply bg-white rounded-xl p-4 shadow-md;\n" +
    "}\n" +
    "\n" +
    "/* Add spacing between items */\n" +
    "tolle-accordion tolle-accordion-item {\n" +
    "  @apply mb-2;\n" +
    "}\n" +
    "\n" +
    "tolle-accordion tolle-accordion-item:last-child {\n" +
    "  @apply mb-0;\n" +
    "}\n" +
    "\n" +
    "/* Style for single mode */\n" +
    "tolle-accordion[type=\"single\"] tolle-accordion-item > div {\n" +
    "  @apply border-2 border-gray-200;\n" +
    "}\n" +
    "\n" +
    "/* Style for multiple mode */\n" +
    "tolle-accordion[type=\"multiple\"] tolle-accordion-item > div {\n" +
    "  @apply border border-gray-300;\n" +
    "}\n" +
    "\n" +
    "/* Style first and last items differently */\n" +
    "tolle-accordion tolle-accordion-item:first-child > div {\n" +
    "  @apply rounded-t-xl;\n" +
    "}\n" +
    "\n" +
    "tolle-accordion tolle-accordion-item:last-child > div {\n" +
    "  @apply rounded-b-xl border-b-0;\n" +
    "}\n" +
    "\n" +
    "/* Dark mode overrides */\n" +
    ".dark {\n" +
    "  tolle-accordion > div {\n" +
    "    @apply bg-gray-800 border border-gray-700;\n" +
    "  }\n" +
    "\n" +
    "  tolle-accordion[type=\"single\"] tolle-accordion-item > div {\n" +
    "    @apply border-gray-600;\n" +
    "  }\n" +
    "\n" +
    "  tolle-accordion[type=\"multiple\"] tolle-accordion-item > div {\n" +
    "    @apply border-gray-500;\n" +
    "  }\n" +
    "}";

  itemOverride = "\n" +
    "/* \n" +
    "  ACCORDION ITEM OVERRIDES\n" +
    "  Leave these empty for custom styling\n" +
    "*/\n" +
    "\n" +
    "/* Main Item Container */\n" +
    "tolle-accordion-item > div {\n" +
    "  /* The main container div */\n" +
    "}\n" +
    "\n" +
    "/* Header/Trigger Button */\n" +
    "tolle-accordion-item button {\n" +
    "  /* The clickable header button */\n" +
    "}\n" +
    "\n" +
    "/* Button Text */\n" +
    "tolle-accordion-item button span {\n" +
    "  /* The title text inside the button */\n" +
    "}\n" +
    "\n" +
    "/* Arrow Icon */\n" +
    "tolle-accordion-item button i {\n" +
    "  /* The expand/collapse arrow icon */\n" +
    "}\n" +
    "\n" +
    "/* Content Wrapper (animated div) */\n" +
    "tolle-accordion-item > div > div:nth-child(2) {\n" +
    "  /* The animated content wrapper */\n" +
    "}\n" +
    "\n" +
    "/* Content Area */\n" +
    "tolle-accordion-item > div > div:nth-child(2) > div {\n" +
    "  /* The actual content div */\n" +
    "}\n" +
    "\n" +
    "/* Content Text */\n" +
    "tolle-accordion-item > div > div:nth-child(2) > div,\n" +
    "tolle-accordion-item .text-muted-foreground {\n" +
    "  /* The content text area */\n" +
    "}\n" +
    "\n" +
    "/* Data State Attributes */\n" +
    "tolle-accordion-item button[data-state=\"open\"] {\n" +
    "  /* Open/expanded state */\n" +
    "}\n" +
    "\n" +
    "tolle-accordion-item button[data-state=\"closed\"] {\n" +
    "  /* Closed/collapsed state */\n" +
    "}\n" +
    "\n" +
    "/* Hover States */\n" +
    "tolle-accordion-item button:hover {\n" +
    "  /* Hover state for header */\n" +
    "}\n" +
    "\n" +
    "tolle-accordion-item button:hover span {\n" +
    "  /* Hover state for title text */\n" +
    "}\n" +
    "\n" +
    "tolle-accordion-item button:hover i {\n" +
    "  /* Hover state for icon */\n" +
    "}\n" +
    "\n" +
    "/* Group Hover */\n" +
    "tolle-accordion-item button.group span.group-hover\\:underline {\n" +
    "  /* Group hover underline effect */\n" +
    "}\n" +
    "\n" +
    "/* Animation States */\n" +
    "tolle-accordion-item .ng-animating {\n" +
    "  /* During animation state */\n" +
    "}\n" +
    "\n" +
    "/* Custom icon rotations */\n" +
    "tolle-accordion-item button[data-state=\"open\"] i {\n" +
    "  /* Icon rotation when open */\n" +
    "}\n" +
    "\n" +
    ".dark {\n" +
    "  /* \n" +
    "  ACCORDION ITEM OVERRIDES\n" +
    "  Leave these empty for custom styling\n" +
    "*/\n" +
    "\n" +
    "  /* Main Item Container */\n" +
    "  tolle-accordion-item > div {\n" +
    "    /* The main container div */\n" +
    "  }\n" +
    "\n" +
    "  /* Header/Trigger Button */\n" +
    "  tolle-accordion-item button {\n" +
    "    /* The clickable header button */\n" +
    "  }\n" +
    "\n" +
    "  /* Button Text */\n" +
    "  tolle-accordion-item button span {\n" +
    "    /* The title text inside the button */\n" +
    "  }\n" +
    "\n" +
    "  /* Arrow Icon */\n" +
    "  tolle-accordion-item button i {\n" +
    "    /* The expand/collapse arrow icon */\n" +
    "  }\n" +
    "\n" +
    "  /* Content Wrapper (animated div) */\n" +
    "  tolle-accordion-item > div > div:nth-child(2) {\n" +
    "    /* The animated content wrapper */\n" +
    "  }\n" +
    "\n" +
    "  /* Content Area */\n" +
    "  tolle-accordion-item > div > div:nth-child(2) > div {\n" +
    "    /* The actual content div */\n" +
    "  }\n" +
    "\n" +
    "  /* Content Text */\n" +
    "  tolle-accordion-item > div > div:nth-child(2) > div,\n" +
    "  tolle-accordion-item .text-muted-foreground {\n" +
    "    /* The content text area */\n" +
    "  }\n" +
    "\n" +
    "  /* Data State Attributes */\n" +
    "  tolle-accordion-item button[data-state=\"open\"] {\n" +
    "    /* Open/expanded state */\n" +
    "  }\n" +
    "\n" +
    "  tolle-accordion-item button[data-state=\"closed\"] {\n" +
    "    /* Closed/collapsed state */\n" +
    "  }\n" +
    "\n" +
    "  /* Hover States */\n" +
    "  tolle-accordion-item button:hover {\n" +
    "    /* Hover state for header */\n" +
    "  }\n" +
    "\n" +
    "  tolle-accordion-item button:hover span {\n" +
    "    /* Hover state for title text */\n" +
    "  }\n" +
    "\n" +
    "  tolle-accordion-item button:hover i {\n" +
    "    /* Hover state for icon */\n" +
    "  }\n" +
    "\n" +
    "  /* Group Hover */\n" +
    "  tolle-accordion-item button.group span.group-hover\\:underline {\n" +
    "    /* Group hover underline effect */\n" +
    "  }\n" +
    "\n" +
    "  /* Animation States */\n" +
    "  tolle-accordion-item .ng-animating {\n" +
    "    /* During animation state */\n" +
    "  }\n" +
    "\n" +
    "  /* Custom icon rotations */\n" +
    "  tolle-accordion-item button[data-state=\"open\"] i {\n" +
    "    /* Icon rotation when open */\n" +
    "  }\n" +
    "}";

  itemExampleOverride = "\n" +
    "/* Add spacing between items */\n" +
    "tolle-accordion tolle-accordion-item {\n" +
    "  margin-bottom: 8px;\n" +
    "}\n" +
    "\n" +
    "tolle-accordion tolle-accordion-item:last-child {\n" +
    "  margin-bottom: 0;\n" +
    "}\n" +
    "\n" +
    "/* Style for single mode */\n" +
    "tolle-accordion[type=\"single\"] tolle-accordion-item > div {\n" +
    "  border: 2px solid #e5e7eb;\n" +
    "}\n" +
    "\n" +
    "/* Style for multiple mode */\n" +
    "tolle-accordion[type=\"multiple\"] tolle-accordion-item > div {\n" +
    "  border: 1px solid #d1d5db;\n" +
    "}\n" +
    "\n" +
    "/* Style first and last items differently */\n" +
    "tolle-accordion tolle-accordion-item:first-child > div {\n" +
    "  border-top-left-radius: 12px;\n" +
    "  border-top-right-radius: 12px;\n" +
    "}\n" +
    "\n" +
    "tolle-accordion tolle-accordion-item:last-child > div {\n" +
    "  border-bottom-left-radius: 12px;\n" +
    "  border-bottom-right-radius: 12px;\n" +
    "  border-bottom: none;\n" +
    "}\n" +
    "\n" +
    "/* Dark mode overrides */\n" +
    ".dark {\n" +
    "  tolle-accordion > div {\n" +
    "    background: #1f2937;\n" +
    "    border: 1px solid #374151;\n" +
    "  }\n" +
    "\n" +
    "  tolle-accordion[type=\"single\"] tolle-accordion-item > div {\n" +
    "    border-color: #4b5563;\n" +
    "  }\n" +
    "\n" +
    "  tolle-accordion[type=\"multiple\"] tolle-accordion-item > div {\n" +
    "    border-color: #6b7280;\n" +
    "  }\n" +
    "}";

  itemTailwindExample = "\n" +
    "@tailwind base;\n" +
    "@tailwind components;\n" +
    "@tailwind utilities;\n" +
    "\n" +
    "/* Add spacing between items */\n" +
    "tolle-accordion tolle-accordion-item {\n" +
    "  @apply mb-2;\n" +
    "}\n" +
    "\n" +
    "tolle-accordion tolle-accordion-item:last-child {\n" +
    "  @apply mb-0;\n" +
    "}\n" +
    "\n" +
    "/* Style for single mode */\n" +
    "tolle-accordion[type=\"single\"] tolle-accordion-item > div {\n" +
    "  @apply border-2 border-gray-200;\n" +
    "}\n" +
    "\n" +
    "/* Style for multiple mode */\n" +
    "tolle-accordion[type=\"multiple\"] tolle-accordion-item > div {\n" +
    "  @apply border border-gray-300;\n" +
    "}\n" +
    "\n" +
    "/* Style first and last items differently */\n" +
    "tolle-accordion tolle-accordion-item:first-child > div {\n" +
    "  @apply rounded-t-xl;\n" +
    "}\n" +
    "\n" +
    "tolle-accordion tolle-accordion-item:last-child > div {\n" +
    "  @apply rounded-b-xl border-b-0;\n" +
    "}\n" +
    "\n" +
    "/* Dark mode overrides */\n" +
    ".dark {\n" +
    "  tolle-accordion > div {\n" +
    "    @apply bg-gray-800 border border-gray-700;\n" +
    "  }\n" +
    "\n" +
    "  tolle-accordion[type=\"single\"] tolle-accordion-item > div {\n" +
    "    @apply border-gray-600;\n" +
    "  }\n" +
    "\n" +
    "  tolle-accordion[type=\"multiple\"] tolle-accordion-item > div {\n" +
    "    @apply border-gray-500;\n" +
    "  }\n" +
    "}";
}
