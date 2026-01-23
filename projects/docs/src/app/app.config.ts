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
      primaryColor: '#353535', // Custom brand color
      radius: '0.7rem',          // Super rounded design
      darkByDefault: false
    }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ]
};
