import { Component, inject } from '@angular/core';
import { BaseService } from '../../../shared/base.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
    selector: 'app-theming-config',
    imports: [BaseEditorComponent],
    templateUrl: './theming-config.component.html'
})
export class ThemingConfigComponent {
    baseService = inject(BaseService);

    appConfigCode = `import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTolleConfig } from '@tolle_/tolle-ui'; // Import

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // Provide Tolle UI Configuration
    provideTolleConfig({
      primaryColor: '#8b5cf6', // Your brand color
      radius: '0.5rem',        // Default border radius
      darkByDefault: false     // Toggle initial dark mode
    })
  ]
};`;
}
