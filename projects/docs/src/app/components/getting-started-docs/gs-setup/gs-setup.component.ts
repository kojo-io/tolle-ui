import { Component, inject } from '@angular/core';
import { BaseService } from '../../../shared/base.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
  selector: 'app-gs-setup',
  imports: [BaseEditorComponent],
  templateUrl: './gs-setup.component.html'
})
export class GSSetupComponent {
  baseService = inject(BaseService);

  appConfigCode = `import { ApplicationConfig } from '@angular/core';
import { provideTolleConfig } from '@tolle_/tolle-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTolleConfig({
      primaryColor: '#8b5cf6', // Indigo
      radius: '0.5rem',
      darkByDefault: false
    })
  ]
};`;

  tailwindConfigCode = `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  presets: [
    require('@tolle_/tolle-ui/preset') // Point to your library preset
  ],
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@tolle_/tolle-ui/**/*.{html,ts,mjs,html}"
  ],
  plugins: [],
};`;

  globalStyles = `{
  "styles": [
    "src/styles.css",
    "node_modules/@tolle_/tolle-ui/theme.css"
  ]
}`;
}

