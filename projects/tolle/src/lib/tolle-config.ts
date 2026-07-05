import { APP_INITIALIZER, InjectionToken, Provider } from '@angular/core';
import { ThemeService } from './theme.service';

export interface TolleConfig {
  primaryColor?: string;
  radius?: string;
  defaultToastDuration?: number;
  darkByDefault?: boolean;
  /** Neutral base-color family: `zinc` | `slate` | `gray` | `neutral` | `stone`. */
  baseColor?: string;
  /** Chart base color (hex); derives `--chart-1…5`. */
  chartColor?: string;
  /** Typography stacks applied to `--font-sans` / `--font-serif` / `--font-mono`. */
  fontSans?: string;
  fontSerif?: string;
  fontMono?: string;
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
