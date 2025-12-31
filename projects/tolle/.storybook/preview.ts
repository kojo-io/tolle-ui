import { Preview} from '@storybook/angular'
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
import {provideZoneChangeDetection} from '@angular/core';
import {provideTolleConfig} from '../src/lib/tolle-config';
setCompodocJson(docJson);

const preview: Preview = {
  decorators: [
    (storyFn, context) => {
      // Get values from globals
      const {
        primaryColor = '#551a65',
        radius = '0.75rem',
        theme = false
      } = context.globals;

      // Convert theme to darkByDefault
      const darkByDefault = theme === 'dark';

      return {
        ...storyFn(),
        applicationConfig: {
          providers: [
            provideZoneChangeDetection({ eventCoalescing: true }),
            provideTolleConfig({
              primaryColor,
              radius,
              darkByDefault
            }),
          ],
        }
      };
    },
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },

  globalTypes: {
    theme: {
      name: 'Theme Mode',
      description: 'Light or dark mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'contrast',
        items: [
          { value: false, title: 'Light', icon: 'sun' },
          { value: true, title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    primaryColor: {
      name: 'Primary Color',
      description: 'Pick your primary brand color',
      defaultValue: '#551a65',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: '#551a65', title: 'Purple (#551a65)' },
          { value: '#2563eb', title: 'Blue (#2563eb)' },
          { value: '#ef4444', title: 'Red (#ef4444)' },
          { value: '#059669', title: 'Green (#059669)' },
          { value: '#f59e0b', title: 'Yellow (#f59e0b)' },
          { value: '#8b5cf6', title: 'Violet (#8b5cf6)' },
          { value: '#ec4899', title: 'Pink (#ec4899)' },
          { value: '#000000', title: 'Custom...' },
        ],
        dynamicTitle: true,
      },
    }
  },
};

export default preview;
