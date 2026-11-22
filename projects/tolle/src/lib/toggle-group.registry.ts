import type { RegistrySidecar } from '../../../registry/src/types';

export const toggleGroupRegistry: RegistrySidecar = {
  description: 'A set of toggle buttons where one (`type="single"`) or several (`type="multiple"`) can be pressed.',
  whenToUse: 'Toolbar choices like text alignment or formatting.',
  alternatives: [
    { name: 'toggle', when: 'there is a single on/off button.' },
    { name: 'segment', when: 'it is a view switcher styled as a segmented control.' },
    { name: 'radio-group', when: 'it is a form question rather than a toolbar.' },
  ],
  forms: {
    ToggleGroupComponent: {
      valueType: 'string | string[]',
      notes: '`type="single"` holds one item value; `type="multiple"` holds an array of item values.',
    },
  },
  pitfalls: [
    'Import `ToggleGroupItemComponent` for the `<tolle-toggle-group-item value="…">` children.',
    'Set `variant` and `size` on the group; items inherit them.',
  ],
  keywords: ['toolbar', 'segmented', 'alignment', 'formatting'],
};
