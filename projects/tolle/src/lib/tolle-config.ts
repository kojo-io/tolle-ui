import { APP_INITIALIZER, InjectionToken, Provider } from '@angular/core';
import { TolleThemeService } from './tolle-theme.service';

export interface TolleConfig {
  primaryColor?: string;
  radius?: string;
  darkByDefault?: boolean;
  surfaceStrategy?: 'neutral' | 'tinted';
}


export const TOLLE_CONFIG = new InjectionToken<TolleConfig>('TOLLE_CONFIG');

export function provideTolleConfig(config: TolleConfig): Provider[] {
  return [
    { provide: TOLLE_CONFIG, useValue: config },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [TolleThemeService],
      useFactory: (themeService: TolleThemeService) => () => themeService.init(),
    },
  ];
}
