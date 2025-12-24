import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideTolleConfig} from '../../../tolle/src/lib/tolle-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideTolleConfig({
      primaryColor: '#9e1f1f', // Custom brand color
      radius: '0.7rem',          // Super rounded design
      darkByDefault: true
    })
  ]
};
