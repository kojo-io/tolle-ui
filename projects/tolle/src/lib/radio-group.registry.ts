import type { RegistrySidecar } from '../../../registry/src/types';

export const radioGroupRegistry: RegistrySidecar = {
  description: 'A set of mutually exclusive options, each a projected `<tolle-radio-item>`; the group holds the value.',
  whenToUse: 'Two to about five options that should all be visible at once.',
  alternatives: [
    { name: 'select', when: 'there are many options or space is tight.' },
    { name: 'segment', when: 'the choice is a compact view switch rather than a form answer.' },
  ],
  parts: ['radio-item'],
  forms: {
    RadioGroupComponent: { notes: 'It holds the `value` of the chosen `<tolle-radio-item>`.' },
  },
  pitfalls: [
    'Bind `[(ngModel)]` / `formControlName` on `<tolle-radio-group>`, never on the items.',
    'Import both `RadioGroupComponent` and `RadioItemComponent`.',
    'The group question goes in `label` on the group (it names the radiogroup); each item\'s text is its content. Show a group error with `[error]` + `errorMessage`.',
  ],
  keywords: ['radio', 'options', 'choice', 'exclusive'],
};
