import type { RegistrySidecar } from '../../../registry/src/types';

export const comboboxRegistry: RegistrySidecar = {
  description:
    'A searchable single-select: a trigger button that opens a filterable list built from an `[options]` array.',
  whenToUse: 'One value from a long or data-driven list, where typing to filter matters.',
  alternatives: [
    { name: 'select', when: 'the options are written in the template or the list is short.' },
    { name: 'command', when: 'you need a command palette or a list of actions, not a form value.' },
    { name: 'multi-select', when: 'several values can be chosen.' },
  ],
  forms: {
    ComboboxComponent: { notes: 'It holds the `value` field of the chosen `ComboboxOption`, not the option object.' },
  },
  pitfalls: [
    'Pass `[options]="[{ label: \'Angular\', value: \'ng\' }]"` (`ComboboxOption[]`) — it does not take projected children.',
    'Filtering is client-side by `label` and `keywords`. For server-side search set `[shouldFilter]="false"` and update `options` from `(searchChange)`.',
    'Give it a visible `label` (or `ariaLabel` when there is none). Its error flag is `[invalid]`, paired with `errorMessage`.',
  ],
  keywords: ['autocomplete', 'typeahead', 'search', 'filter', 'dropdown'],
};
