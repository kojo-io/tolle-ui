import { InjectionToken, Provider } from '@angular/core';

export interface TolleConfig {
  primaryColor?: string;
  radius?: string;
  defaultToastDuration?: number;
  darkByDefault?: boolean;
}

export const TOLLE_CONFIG = new InjectionToken<TolleConfig>('TolleConfig');

export function provideTolleConfig(config: TolleConfig): Provider[] {
  return [
    {
      provide: TOLLE_CONFIG,
      useValue: config
    }
  ];
}
