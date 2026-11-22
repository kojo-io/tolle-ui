import type { RegistrySidecar } from '../../../registry/src/types';

export const checkboxRegistry: RegistrySidecar = {
  description: 'A boolean checkbox form control.',
  whenToUse: 'Opt-ins, agreeing to terms, or one of several independent options in a list.',
  alternatives: [
    { name: 'switch', when: 'the setting takes effect immediately (on/off), rather than on submit.' },
    { name: 'radio-group', when: 'exactly one of several options must be chosen.' },
  ],
  pitfalls: [
    'Bind with `[(ngModel)]` or `formControlName`. There is no `[checked]` input — "checked" is internal styling state.',
    'Label it with the `label` input: `<tolle-checkbox label="Accept terms" [(ngModel)]="accepted" />` — clicking the text toggles it. For a custom layout, set `id="terms"` and use `<tolle-label for="terms">`; the id lands on the inner button.',
  ],
  keywords: ['checkbox', 'tick', 'agree', 'boolean'],
};
