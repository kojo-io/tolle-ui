import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideTolleConfig} from '@tolle/ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideTolleConfig({
      primaryColor: '#121212', // Custom brand color
      radius: '0.7rem',          // Super rounded design
      darkByDefault: false
    })
  ]
};
