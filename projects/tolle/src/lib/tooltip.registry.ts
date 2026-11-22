import type { RegistrySidecar } from '../../../registry/src/types';

export const tooltipRegistry: RegistrySidecar = {
  description: 'A directive that shows a short text label on hover and focus: `tolleTooltip="Edit"`.',
  whenToUse: 'Naming icon-only buttons and explaining controls in a few words.',
  alternatives: [
    { name: 'hover-card', when: 'the hover content is rich (avatar, links, details).' },
    { name: 'popover', when: 'the content is interactive or opens on click.' },
  ],
  pitfalls: [
    'It is a directive on an existing element — `<tolle-button tolleTooltip="Edit" placement="top">` — not a `<tolle-tooltip>` element. Import `TooltipDirective`.',
    'Text only. For markup use a hover card or popover.',
    'A tooltip does not replace an `aria-label` on icon-only buttons.',
  ],
  keywords: ['tooltip', 'hint', 'title', 'hover'],
};
