import { APP_INITIALIZER, InjectionToken, Provider } from '@angular/core';
import { ThemeService } from './theme.service';

export interface TolleConfig {
  primaryColor?: string;
  radius?: string;
  defaultToastDuration?: number;
  darkByDefault?: boolean;
}

export const TOLLE_CONFIG = new InjectionToken<TolleConfig>('TolleConfig');

export function provideTolleConfig(config: TolleConfig): Provider[] {
  return [
    { provide: TOLLE_CONFIG, useValue: config },
    {
      provide: APP_INITIALIZER,
      useFactory: (_: ThemeService) => () => {
        // Theme is already initialized in constructor
        // This factory ensures themeService is instantiated during bootstrap
      },
      deps: [ThemeService],
      multi: true,
    },
  ];
}
