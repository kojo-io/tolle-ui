import { Component, inject } from '@angular/core';
import { BaseService } from '../../../shared/base.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
    selector: 'app-theming-integration',
    imports: [BaseEditorComponent],
    templateUrl: './theming-integration.component.html'
})
export class ThemingIntegrationComponent {
    baseService = inject(BaseService);

    globalStyles = `{
  "styles": [
    "src/styles.css",
    "node_modules/@tolle_/tolle-ui/styles/theme.css" 
  ]
}`;

    tailwindConfigCode = `const { tolleUi } = require('@tolle_/tolle-ui/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    // Include Tolle UI sources
    "./node_modules/@tolle_/tolle-ui/**/*.{html,ts,mjs}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    tolleUi({
       // Optional: override prefix
       // prefix: 'tolle-'
    })
  ],
}`;

    tailAlongside = `<div class="p-4 bg-primary-50 rounded-lg">
  <tolle-button>Click Me</tolle-button>
  <p class="mt-2 text-primary-700">Custom helper text</p>
</div>`;
}
