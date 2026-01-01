import { provideHttpClient, withInterceptorsFromDi, withFetch } from "@angular/common/http";
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideTolleConfig} from '../../../tolle/src/lib/tolle-config';
import { provideRouter } from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideTolleConfig({
      primaryColor: '#353535', // Custom brand color
      radius: '0.7rem',          // Super rounded design
      darkByDefault: false
    }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ]
};


