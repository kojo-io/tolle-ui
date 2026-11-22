import type { RegistrySidecar } from '../../../registry/src/types';

export const multiSelectRegistry: RegistrySidecar = {
  description:
    'A dropdown for choosing several values, shown as chips on the trigger. Options are projected `<tolle-select-item>` children.',
  whenToUse: 'The user picks any number of values from a list, optionally capped with `maxSelections`.',
  alternatives: [
    { name: 'select', when: 'only one value can be chosen.' },
    { name: 'tag-input', when: 'the user types free-form values rather than choosing from a list.' },
    { name: 'toggle-group', when: 'a handful of options should stay visible as buttons.' },
  ],
  pitfalls: [
    'Children are `<tolle-select-item>` from the Select page — import `SelectItemComponent` as well as `MultiSelectComponent`.',
    'The bound value is an array (`string[]` etc.). Initialise it to `[]`, not `null` or `\'\'`.',
    '`maxDisplayItems` only limits how many chips show on the trigger; `maxSelections` limits what can be chosen.',
  ],
  keywords: ['multiple', 'chips', 'tags', 'checklist'],
};
