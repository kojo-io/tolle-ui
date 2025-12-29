import { provideHttpClient, withInterceptorsFromDi, withFetch } from "@angular/common/http";
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideTolleConfig} from '../../../tolle/src/lib/tolle-config';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideTolleConfig({
      primaryColor: '#551a65', // Custom brand color
      radius: '0.75rem',          // Super rounded design
      darkByDefault: false
    }),
    provideRouter([]),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ]
};


