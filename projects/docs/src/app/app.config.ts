import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTolleConfig } from '../../../tolle/src/lib/tolle-config';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideTolleConfig({
      primaryColor: '#2563eb', // Tolle brand blue (matches theme.css + the design)
      radius: '0.5rem',        // shadcn-style radius
      darkByDefault: false
    }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ]
};
