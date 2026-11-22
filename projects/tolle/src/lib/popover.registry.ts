import type { RegistrySidecar } from '../../../registry/src/types';

export const popoverRegistry: RegistrySidecar = {
  description: 'A floating panel anchored to a trigger, opened on click, for small interactive content.',
  whenToUse: 'Quick settings, small forms, pickers or details next to the control that opened them.',
  alternatives: [
    { name: 'dropdown-menu', when: 'the panel is a list of actions.' },
    { name: 'hover-card', when: 'it should open on hover.' },
    { name: 'tooltip', when: 'it is a short text label.' },
    { name: 'modal', when: 'the content is large or needs full focus.' },
  ],
  pitfalls: [
    'Mark the trigger with the `trigger` attribute and wrap the panel in `<tolle-popover-content>`: `<tolle-popover><tolle-button trigger>Open</tolle-button><tolle-popover-content>…</tolle-popover-content></tolle-popover>`.',
    'Import `PopoverContentComponent` as well as `PopoverComponent`.',
  ],
  keywords: ['popover', 'popup', 'floating', 'flyout'],
};
