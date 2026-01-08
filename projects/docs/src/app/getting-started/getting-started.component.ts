import {Component, inject, OnInit} from '@angular/core';
import {BaseEditorComponent} from '../shared/base-editor/base-editor.component';
import {BaseService} from '../shared/base.service';
import {AnalyticsService} from '../../../../showcase/src/app/analytics.service';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [
    BaseEditorComponent
  ],
  templateUrl: './getting-started.component.html',
  styleUrl: './getting-started.component.css'
})
export class GettingStartedComponent implements OnInit {
  baseService = inject(BaseService);

  analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }

  install = 'npm install @tolle_/tolle-ui @floating-ui/dom class-variance-authority date-fns'

  appConfigCode = "import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';\n" +
    "import { provideTolleConfig } from '@tolle_/tolle-ui';\n" +
    "\n" +
    "export const appConfig: ApplicationConfig = {\n" +
    "  providers: [\n" +
    "    provideZoneChangeDetection({ eventCoalescing: true }),\n" +
    "\n" +
    "    provideTolleConfig({\n" +
    "      primaryColor: '#551a65',\n" +
    "      radius: '0.75rem',\n" +
    "      darkByDefault: false,\n" +
    "    }),\n" +
    "  ],\n" +
    "};"

  tailwindConfigCode = "module.exports = {\n" +
    "  darkMode: 'class',\n" +
    "  presets: [require('@tolle_/tolle-ui/preset')],\n" +
    "  content: [\n" +
    "    './src/**/*.{html,ts}',\n" +
    "    './node_modules/@tolle_/tolle-ui/**/*.{html,ts,mjs}',\n" +
    "  ],\n" +
    "};"


  globalStyles = "\"styles\": [\n" +
    "  \"src/styles.css\",\n" +
    "  \"node_modules/@tolle_/tolle-ui/theme.css\"\n" +
    "]"

  baseHtml = "<div class=\"bg-background text-foreground\">\n" +
    "  <!-- Your Tolle UI components here and other elemets -->\n" +
    "</div>"

}
