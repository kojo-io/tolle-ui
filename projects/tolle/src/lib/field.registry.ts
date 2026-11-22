import type { RegistrySidecar } from '../../../registry/src/types';

export const fieldRegistry: RegistrySidecar = {
  description:
    'Form layout primitives: a field with label, description and error, plus groups, fieldsets and legends for building forms.',
  whenToUse:
    'Grouping several controls into a form section (fieldset + legend), horizontal label/control rows, or several errors for one field. For a single control, its own `label` / `hint` / `errorMessage` inputs are simpler.',
  alternatives: [
    { name: 'input', when: 'a single control — every form control already has `label`, `hint` and `errorMessage`.' },
  ],
  pitfalls: [
    'Mark the field `[invalid]="ctrl.invalid && ctrl.touched"` and pass messages to `<tolle-field-error [errors]="…">`.',
    'Use `orientation="horizontal"` for a control beside its label (switches, checkboxes).',
  ],
  keywords: ['form', 'label', 'error', 'fieldset', 'layout'],
};
