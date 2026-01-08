import {Component, inject, OnInit} from '@angular/core';
import {BaseService} from '../shared/base.service';
import {BaseEditorComponent} from '../shared/base-editor/base-editor.component';
import {AnalyticsService} from '../../../../showcase/src/app/analytics.service';
import {coloris, init} from '@melloware/coloris';

@Component({
  selector: 'app-theming',
  standalone: true,
  imports: [
    BaseEditorComponent
  ],
  templateUrl: './theming.component.html',
  styleUrl: './theming.component.css'
})
export class ThemingComponent implements OnInit{
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }

  primaryGen = "primary-50 → primary-950";

  appConfigCode = "provideTolleConfig({\n" +
    "  primaryColor: '#353535', // Custom brand color\n" +
    "  radius: '0.625rem',        // Global border radius\n" +
    "  darkByDefault: false     // Default theme mode\n" +
    "});\n";


  globalStyles = "\"styles\": [\n" +
    "  \"src/styles.css\",\n" +
    "  \"node_modules/@tolle_/tolle-ui/theme.css\"\n" +
    "]";

  tailwindConfigCode = "module.exports = {\n" +
    "  darkMode: 'class',\n" +
    "  presets: [require('@tolle_/tolle-ui/preset')],\n" +
    "  content: [\n" +
    "    './src/**/*.{html,ts}',\n" +
    "    './node_modules/@tolle_/tolle-ui/**/*.{html,ts,mjs}',\n" +
    "  ],\n" +
    "};";

  tailAlongside = "<div class=\"bg-neutral-900 text-foreground text-nuetral-50\">\n" +
    "  Content\n" +
    "</div>";

  baseOverride = "@tailwind base;\n" +
    "@tailwind components;\n" +
    "@tailwind utilities;\n" +
    "\n" +
    "/* Main Container */\n" +
    "tolle-segment {\n" +
    "  /* Host wrapper */\n" +
    "}\n" +
    "\n" +
    "/* Inner Container */\n" +
    "tolle-segment > div {\n" +
    "  /* Flex container */\n" +
    "}\n" +
    "\n" +
    "/* Active Slider */\n" +
    "tolle-segment > div > div:first-child {\n" +
    "  @apply bg-primary !important;\n" +
    "}\n" +
    "\n" +
    "/* All Buttons */\n" +
    "tolle-segment button[role=\"tab\"] {\n" +
    "}\n" +
    "\n" +
    "/* Selected Button */\n" +
    "tolle-segment button[role=\"tab\"][aria-selected=\"true\"] {\n" +
    "  @apply text-white !important;\n" +
    "}";

  baseDarkOverride = ".dark {\n" +
    "  tolle-segment > div > div:first-child {\n" +
    "    /* Dark mode slider styles */\n" +
    "  }\n" +
    "\n" +
    "  tolle-segment button[role=\"tab\"][aria-selected=\"true\"] {\n" +
    "    /* Dark selected state */\n" +
    "  }\n" +
    "}";

  baseDarkOverride2 = "tolle-segment button[role=\"tab\"]:hover {\n" +
    "  /* Hover styles */\n" +
    "}\n" +
    "\n" +
    "tolle-segment button[role=\"tab\"] i {\n" +
    "  /* Icon styles */\n" +
    "}\n" +
    "\n" +
    "tolle-segment button[role=\"tab\"] span {\n" +
    "  /* Text styles */\n" +
    "}";
}
