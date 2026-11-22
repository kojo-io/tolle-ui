import type { RegistrySidecar } from '../../../registry/src/types';

export const labelRegistry: RegistrySidecar = {
  description: 'A styled form label for custom layouts.',
  whenToUse:
    'Only when the label must sit apart from the control. Every Tolle form control already takes a `label` input, which is the default choice.',
  alternatives: [{ name: 'field', when: 'you also need a description or error message laid out around several controls.' }],
  pitfalls: [
    'Prefer the control\'s own `label` input (`<tolle-select label="Country">`, `<tolle-checkbox label="Accept">`).',
    'With `for`, give the control the same `id`: `<tolle-label for="plan">` + `<tolle-select id="plan">`. Tolle controls move that id to their focusable element, so the label reaches it.',
  ],
  keywords: ['label', 'form'],
};
