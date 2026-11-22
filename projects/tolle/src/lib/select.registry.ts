import type { RegistrySidecar } from '../../../registry/src/types';

export const selectRegistry: RegistrySidecar = {
  description:
    'A single-value dropdown whose options are projected `<tolle-select-item>` children, with optional search, groups and separators.',
  whenToUse: 'The user picks exactly one value from a short-to-medium list you write in the template.',
  alternatives: [
    { name: 'combobox', when: 'the options come from an array and need type-to-filter search.' },
    { name: 'multi-select', when: 'the user can pick several values.' },
    { name: 'native-select', when: 'you want the platform picker (best on mobile) or a plain `<select>`.' },
    { name: 'radio-group', when: 'there are 2–5 options and they should all stay visible.' },
  ],
  parts: ['select-item', 'select-group', 'select-separator'],
  forms: {
    SelectComponent: { notes: 'It holds the `value` of the chosen `<tolle-select-item>` (whatever type you bind there).' },
  },
  pitfalls: [
    'Options are `<tolle-select-item value="…">` children — import `SelectItemComponent` too. There is no `[options]` input.',
    'Bind the selection with `[(ngModel)]` or `formControlName`. `selected` on an item is set by the select; never bind it.',
    'For a non-string value use `[value]="obj"` on the item; `value="1"` is the string "1".',
    '`valueChange` fires on user choice only; to react to programmatic changes use `ngModelChange` or the form control.',
    'Use `label`, `hint`, `errorMessage` and `[error]` on the select itself rather than wrapping it in your own label markup.',
  ],
  keywords: ['dropdown', 'picker', 'options', 'choose'],
};
