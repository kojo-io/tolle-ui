import type { RegistrySidecar } from '../../../registry/src/types';

export const badgeRegistry: RegistrySidecar = {
  description: 'A small label for status, counts or categories, optionally removable.',
  whenToUse: 'Statuses ("Active"), counts, tags and categories inline with text.',
  alternatives: [{ name: 'tag-input', when: 'the user adds and removes the tags themselves in a form.' }],
  pitfalls: [
    'A leading icon goes in the `prefix` slot: `<tolle-badge><i prefix class="ri-check-line"></i> Done</tolle-badge>`.',
    '`[removable]="true"` only shows the × button; remove the badge yourself in `(onRemove)`.',
  ],
  keywords: ['badge', 'chip', 'pill', 'status', 'tag', 'label'],
};
