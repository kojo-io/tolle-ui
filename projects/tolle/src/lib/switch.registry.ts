import type { RegistrySidecar } from '../../../registry/src/types';

export const switchRegistry: RegistrySidecar = {
  description: 'An on/off toggle switch form control.',
  whenToUse: 'Settings that apply immediately, like enabling notifications.',
  alternatives: [
    { name: 'checkbox', when: 'the choice is submitted with a form, or appears in a list of options.' },
    { name: 'toggle', when: 'it is a pressed/unpressed toolbar button (bold, italic).' },
  ],
  pitfalls: [
    'Bind with `[(ngModel)]` or `formControlName`. There is no `[checked]` input.',
    'Label it with the `label` input: `<tolle-switch label="Email notifications" [(ngModel)]="notify" />`. For a label elsewhere, set `id` and point `<tolle-label for>` at it.',
  ],
  keywords: ['switch', 'toggle', 'on off', 'setting', 'boolean'],
};
