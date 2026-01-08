import {Component, inject, OnInit} from '@angular/core';
import {BaseService} from '../../shared/base.service';
import {BaseEditorComponent} from '../../shared/base-editor/base-editor.component';
import {NgIf} from '@angular/common';
import {SegmentedComponent} from '../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {AvatarComponent} from '../../../../../tolle/src/lib/avatar.component';
import {AvatarFallbackComponent} from '../../../../../tolle/src/lib/avatar-fallback.component';
import {AnalyticsService} from '../../../../../showcase/src/app/analytics.service';

@Component({
  selector: 'app-avatar-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    NgIf,
    SegmentedComponent,
    FormsModule,
    AvatarComponent,
    AvatarFallbackComponent,
  ],
  templateUrl: './avatar-docs.component.html',
  styleUrl: './avatar-docs.component.css'
})
export class AvatarDocsComponent implements OnInit {
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

  installation = "import {AlertComponent} from '@tolle_/tolle-ui';\n" +
    "\n" +
    "\n" +
    "imports: [\n" +
    "    AlertComponent,\n" +
    "  ]";

  componentBase = "<div class=\"flex gap-2 max-h-max\">\n" +
    "  <tolle-avatar src=\"https://github.com/nutlope.png\" alt=\"User Name\">\n" +
    "    <tolle-avatar-fallback>JD</tolle-avatar-fallback>\n" +
    "  </tolle-avatar>\n" +
    "\n" +
    "  <tolle-avatar size=\"lg\">\n" +
    "    <tolle-avatar-fallback>\n" +
    "      <i class=\"ri-user-line text-2xl\"></i>\n" +
    "    </tolle-avatar-fallback>\n" +
    "  </tolle-avatar>\n" +
    "\n" +
    "\n" +
    "\n" +
    "  <div class=\"flex -space-x-4\">\n" +
    "    <tolle-avatar src=\"https://github.com/nutlope.png\" class=\"ring-2 bg-popover\"></tolle-avatar>\n" +
    "    <tolle-avatar src=\"https://github.com/nutlope.png\" class=\"ring-2 bg-popover\"></tolle-avatar>\n" +
    "    <tolle-avatar src=\"https://github.com/nutlope.png\" class=\"ring-2 bg-popover\"></tolle-avatar>\n" +
    "    <tolle-avatar class=\"ring-2 bg-popover\">\n" +
    "      <tolle-avatar-fallback>+5</tolle-avatar-fallback>\n" +
    "    </tolle-avatar>\n" +
    "  </div>\n" +
    "</div>";

  componentExampleOverride = "avatar-component-override";

  componentViewOptions = [
    { label: 'avatar-component-override.css', value: 'avatar-component-override' },
    { label: 'override-example-tailwind.css', value: 'override-example-tailwind' }
  ];

  componentFallbackExampleOverride = "avatar-fallback-component-override";

  componentFallbackViewOptions = [
    { label: 'avatar-fallback-component-override.css', value: 'avatar-fallback-component-override' },
    { label: 'override-example-tailwind.css', value: 'override-example-tailwind' }
  ];

  avatarOverride = "/* \n" +
    "  AVATAR COMPONENT OVERRIDES\n" +
    "  Leave these empty for custom styling\n" +
    "*/\n" +
    "\n" +
    "/* Host Element (tolle-avatar) */\n" +
    "tolle-avatar {\n" +
    "  /* The component host element itself */\n" +
    "}\n" +
    "\n" +
    "/* Size-specific overrides */\n" +
    "tolle-avatar[size=\"sm\"] {\n" +
    "  /* Small size variant */\n" +
    "}\n" +
    "\n" +
    "tolle-avatar[size=\"default\"] {\n" +
    "  /* Default size variant */\n" +
    "}\n" +
    "\n" +
    "tolle-avatar[size=\"lg\"] {\n" +
    "  /* Large size variant */\n" +
    "}\n" +
    "\n" +
    "tolle-avatar[size=\"xl\"] {\n" +
    "  /* Extra large size variant */\n" +
    "}\n" +
    "\n" +
    "/* Shape-specific overrides */\n" +
    "tolle-avatar[shape=\"circle\"] {\n" +
    "  /* Circle shape variant */\n" +
    "}\n" +
    "\n" +
    "tolle-avatar[shape=\"square\"] {\n" +
    "  /* Square shape variant */\n" +
    "}\n" +
    "\n" +
    "/* Image Element */\n" +
    "tolle-avatar img {\n" +
    "  /* Avatar image when loaded successfully */\n" +
    "}\n" +
    "\n" +
    "/* Loading State */\n" +
    "tolle-avatar img.opacity-0 {\n" +
    "  /* Image during loading (hidden) */\n" +
    "}\n" +
    "\n" +
    "/* Fallback Container */\n" +
    "tolle-avatar > div {\n" +
    "  /* Fallback container when no image or error */\n" +
    "}\n" +
    "\n" +
    "/* Fallback Content */\n" +
    "tolle-avatar > div > ng-content {\n" +
    "  /* Content inside fallback (typically initials or icon) */\n" +
    "}\n" +
    "\n" +
    "/* Error State */\n" +
    "tolle-avatar .bg-muted {\n" +
    "  /* Background color for error/fallback state */\n" +
    "}\n" +
    "\n" +
    "/* Loading Animation (if you add one) */\n" +
    "tolle-avatar .animate-pulse {\n" +
    "  /* Loading animation class */\n" +
    "}\n" +
    "\n" +
    ".dark {\n" +
    "  /* \n" +
    "  AVATAR COMPONENT OVERRIDES\n" +
    "  Leave these empty for custom styling\n" +
    "*/\n" +
    "\n" +
    "  /* Host Element (tolle-avatar) */\n" +
    "  tolle-avatar {\n" +
    "    /* The component host element itself */\n" +
    "  }\n" +
    "\n" +
    "  /* Size-specific overrides */\n" +
    "  tolle-avatar[size=\"sm\"] {\n" +
    "    /* Small size variant */\n" +
    "  }\n" +
    "\n" +
    "  tolle-avatar[size=\"default\"] {\n" +
    "    /* Default size variant */\n" +
    "  }\n" +
    "\n" +
    "  tolle-avatar[size=\"lg\"] {\n" +
    "    /* Large size variant */\n" +
    "  }\n" +
    "\n" +
    "  tolle-avatar[size=\"xl\"] {\n" +
    "    /* Extra large size variant */\n" +
    "  }\n" +
    "\n" +
    "  /* Shape-specific overrides */\n" +
    "  tolle-avatar[shape=\"circle\"] {\n" +
    "    /* Circle shape variant */\n" +
    "  }\n" +
    "\n" +
    "  tolle-avatar[shape=\"square\"] {\n" +
    "    /* Square shape variant */\n" +
    "  }\n" +
    "\n" +
    "  /* Image Element */\n" +
    "  tolle-avatar img {\n" +
    "    /* Avatar image when loaded successfully */\n" +
    "  }\n" +
    "\n" +
    "  /* Loading State */\n" +
    "  tolle-avatar img.opacity-0 {\n" +
    "    /* Image during loading (hidden) */\n" +
    "  }\n" +
    "\n" +
    "  /* Fallback Container */\n" +
    "  tolle-avatar > div {\n" +
    "    /* Fallback container when no image or error */\n" +
    "  }\n" +
    "\n" +
    "  /* Fallback Content */\n" +
    "  tolle-avatar > div > ng-content {\n" +
    "    /* Content inside fallback (typically initials or icon) */\n" +
    "  }\n" +
    "\n" +
    "  /* Error State */\n" +
    "  tolle-avatar .bg-muted {\n" +
    "    /* Background color for error/fallback state */\n" +
    "  }\n" +
    "\n" +
    "  /* Loading Animation (if you add one) */\n" +
    "  tolle-avatar .animate-pulse {\n" +
    "    /* Loading animation class */\n" +
    "  }\n" +
    "}";

  exampleOverride = "@tailwind base;\n" +
    "@tailwind components;\n" +
    "@tailwind utilities;\n" +
    "\n" +
    "/* Custom avatar container */\n" +
    "tolle-avatar {\n" +
    "  @apply shadow-md hover:shadow-lg transition-shadow duration-300;\n" +
    "}\n" +
    "\n" +
    "/* Custom size variants */\n" +
    "tolle-avatar[size=\"sm\"] {\n" +
    "  @apply h-7 w-7;\n" +
    "}\n" +
    "\n" +
    "tolle-avatar[size=\"xl\"] {\n" +
    "  @apply h-32 w-32 ring-4 ring-white shadow-xl;\n" +
    "}\n" +
    "\n" +
    "/* Custom shape variants */\n" +
    "tolle-avatar[shape=\"circle\"] {\n" +
    "  @apply rounded-full;\n" +
    "}\n" +
    "\n" +
    "tolle-avatar[shape=\"square\"] {\n" +
    "  @apply rounded-lg;\n" +
    "}\n" +
    "\n" +
    "/* Image styling */\n" +
    "tolle-avatar img {\n" +
    "  @apply hover:scale-105 transition-transform duration-300;\n" +
    "}\n" +
    "\n" +
    "/* Fallback container enhancements */\n" +
    "tolle-avatar > div {\n" +
    "  @apply bg-gradient-to-br from-primary/20 to-secondary/20 text-foreground font-semibold;\n" +
    "}\n" +
    "\n" +
    "/* Loading state animation */\n" +
    "tolle-avatar img.opacity-0 {\n" +
    "  @apply animate-pulse bg-neutral-200;\n" +
    "}\n" +
    "\n" +
    "/* Status indicator ring */\n" +
    "tolle-avatar.online {\n" +
    "  @apply ring-2 ring-green-500;\n" +
    "}\n" +
    "\n" +
    "tolle-avatar.offline {\n" +
    "  @apply ring-2 ring-neutral-300;\n" +
    "}\n" +
    "\n" +
    "/* Group avatar spacing */\n" +
    "tolle-avatar:not(:first-child) {\n" +
    "  @apply -ml-2;\n" +
    "}\n" +
    "\n" +
    "/* Dark mode overrides */\n" +
    ".dark {\n" +
    "  tolle-avatar > div {\n" +
    "    @apply bg-neutral-800 text-neutral-100;\n" +
    "  }\n" +
    "\n" +
    "  tolle-avatar img.opacity-0 {\n" +
    "    @apply bg-neutral-700;\n" +
    "  }\n" +
    "}";

  fallbackOverride = "/* \n" +
    "  AVATAR FALLBACK COMPONENT OVERRIDES\n" +
    "  Leave these empty for custom styling\n" +
    "*/\n" +
    "\n" +
    "/* Host Element (tolle-avatar-fallback) */\n" +
    "tolle-avatar-fallback {\n" +
    "  /* The component host element */\n" +
    "}\n" +
    "\n" +
    "/* Inner Container */\n" +
    "tolle-avatar-fallback > div {\n" +
    "  /* The main container div */\n" +
    "}\n" +
    "\n" +
    "/* Content wrapper */\n" +
    "tolle-avatar-fallback .flex {\n" +
    "  /* Flex container for centering */\n" +
    "}\n" +
    "\n" +
    "/* Background color */\n" +
    "tolle-avatar-fallback .bg-muted {\n" +
    "  /* Background color class */\n" +
    "}\n" +
    "\n" +
    "/* Text styling */\n" +
    "tolle-avatar-fallback .text-muted-foreground {\n" +
    "  /* Text color class */\n" +
    "}\n" +
    "\n" +
    "/* Font styling */\n" +
    "tolle-avatar-fallback .font-medium {\n" +
    "  /* Font weight */\n" +
    "}\n" +
    "\n" +
    "tolle-avatar-fallback .uppercase {\n" +
    "  /* Text transform */\n" +
    "}\n" +
    "\n" +
    "/* Projected content */\n" +
    "tolle-avatar-fallback ng-content {\n" +
    "  /* Content projected into the fallback */\n" +
    "}\n" +
    "\n" +
    ".dark {\n" +
    "  /* \n" +
    "  AVATAR FALLBACK COMPONENT OVERRIDES\n" +
    "  Leave these empty for custom styling\n" +
    "*/\n" +
    "\n" +
    "  /* Host Element (tolle-avatar-fallback) */\n" +
    "  tolle-avatar-fallback {\n" +
    "    /* The component host element */\n" +
    "  }\n" +
    "\n" +
    "  /* Inner Container */\n" +
    "  tolle-avatar-fallback > div {\n" +
    "    /* The main container div */\n" +
    "  }\n" +
    "\n" +
    "  /* Content wrapper */\n" +
    "  tolle-avatar-fallback .flex {\n" +
    "    /* Flex container for centering */\n" +
    "  }\n" +
    "\n" +
    "  /* Background color */\n" +
    "  tolle-avatar-fallback .bg-muted {\n" +
    "    /* Background color class */\n" +
    "  }\n" +
    "\n" +
    "  /* Text styling */\n" +
    "  tolle-avatar-fallback .text-muted-foreground {\n" +
    "    /* Text color class */\n" +
    "  }\n" +
    "\n" +
    "  /* Font styling */\n" +
    "  tolle-avatar-fallback .font-medium {\n" +
    "    /* Font weight */\n" +
    "  }\n" +
    "\n" +
    "  tolle-avatar-fallback .uppercase {\n" +
    "    /* Text transform */\n" +
    "  }\n" +
    "\n" +
    "  /* Projected content */\n" +
    "  tolle-avatar-fallback ng-content {\n" +
    "    /* Content projected into the fallback */\n" +
    "  }\n" +
    "}";

  fallbackTailwindOverride = "@tailwind base;\n" +
    "@tailwind components;\n" +
    "@tailwind utilities;\n" +
    "\n" +
    "/* Custom fallback styling */\n" +
    "tolle-avatar-fallback > div {\n" +
    "  @apply bg-gradient-to-br from-primary/20 to-secondary/20\n" +
    "  text-primary-foreground\n" +
    "  font-semibold\n" +
    "  hover:from-primary/30 hover:to-secondary/30\n" +
    "  transition-all duration-300\n" +
    "  rounded-full;\n" +
    "}\n" +
    "\n" +
    "/* Different fallback variants */\n" +
    "tolle-avatar-fallback.initials > div {\n" +
    "  @apply tracking-wider text-lg;\n" +
    "}\n" +
    "\n" +
    "tolle-avatar-fallback.icon > div {\n" +
    "  @apply text-xl;\n" +
    "}\n" +
    "\n" +
    "/* Size-specific fallbacks */\n" +
    "tolle-avatar-fallback.sm > div {\n" +
    "  @apply text-xs;\n" +
    "}\n" +
    "\n" +
    "tolle-avatar-fallback.lg > div {\n" +
    "  @apply text-lg;\n" +
    "}\n" +
    "\n" +
    "tolle-avatar-fallback.xl > div {\n" +
    "  @apply text-2xl;\n" +
    "}\n" +
    "\n" +
    "/* Shape-specific fallbacks */\n" +
    "tolle-avatar-fallback.circle > div {\n" +
    "  @apply rounded-full;\n" +
    "}\n" +
    "\n" +
    "tolle-avatar-fallback.square > div {\n" +
    "  @apply rounded-md;\n" +
    "}\n" +
    "\n" +
    "/* Status-based fallbacks */\n" +
    "tolle-avatar-fallback.online > div {\n" +
    "  @apply ring-2 ring-green-500;\n" +
    "}\n" +
    "\n" +
    "tolle-avatar-fallback.offline > div {\n" +
    "  @apply ring-2 ring-neutral-300;\n" +
    "}\n" +
    "\n" +
    "tolle-avatar-fallback.away > div {\n" +
    "  @apply ring-2 ring-amber-500;\n" +
    "}\n" +
    "\n" +
    "/* Interactive fallbacks */\n" +
    "tolle-avatar-fallback.interactive > div {\n" +
    "  @apply cursor-pointer hover:scale-105 active:scale-95\n" +
    "  transition-transform duration-200;\n" +
    "}\n" +
    "\n" +
    ".dark {\n" +
    "  /* Dark mode overrides */\n" +
    "  tolle-avatar-fallback > div {\n" +
    "    @apply bg-neutral-800 text-neutral-100;\n" +
    "  }\n" +
    "\n" +
    "  tolle-avatar-fallback.initials > div {\n" +
    "    @apply text-neutral-50;\n" +
    "  }\n" +
    "\n" +
    "  tolle-avatar-fallback.icon > div {\n" +
    "    @apply text-neutral-200;\n" +
    "  }\n" +
    "}";
}
