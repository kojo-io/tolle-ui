import type { RegistrySidecar } from '../../../registry/src/types';

export const buttonRegistry: RegistrySidecar = {
  description: 'A button with visual variants, sizes (including icon-only sizes) and a busy state.',
  whenToUse: 'Any clickable action. Use it as the trigger inside dialogs, sheets, dropdowns and popovers too.',
  alternatives: [
    { name: 'toggle', when: 'the button represents an on/off state.' },
    { name: 'button-group', when: 'several related buttons should be visually joined.' },
  ],
  pitfalls: [
    '`type` defaults to `"button"`, so it will not submit a form — set `type="submit"` on submit buttons.',
    'Icon-only buttons use `size="icon"` (or `icon-xs` / `icon-sm` / `icon-lg`) and need an `aria-label`.',
    'Use `[busy]="saving"` for async work instead of swapping the label for a spinner; it also blocks double clicks.',
    'Handle clicks with plain `(click)` — there is no custom click output.',
  ],
  keywords: ['button', 'action', 'cta', 'submit', 'icon button'],
};
