import type { RegistrySidecar } from '../../../registry/src/types';

export const alertRegistry: RegistrySidecar = {
  description: 'An inline callout for important messages, with a title, an icon slot, variants and optional dismiss.',
  whenToUse: 'Messages that belong in the page flow: warnings above a form, errors after submit, notices.',
  alternatives: [
    { name: 'toaster', when: 'the message is transient feedback.' },
    { name: 'alert-dialog', when: 'the user must confirm something.' },
  ],
  pitfalls: [
    'Put the icon in the `icon` slot: `<i icon class="ri-information-line"></i>`.',
    '`[dismissible]="true"` adds a × button that hides the alert and emits `(onClose)`. To show it again later, re-create it (e.g. toggle an `@if`).',
  ],
  keywords: ['alert', 'callout', 'banner', 'notice', 'warning', 'error message'],
};
