import type { RegistrySidecar } from '../../../registry/src/types';

export const accordionRegistry: RegistrySidecar = {
  description: 'Vertically stacked sections that expand and collapse; each `<tolle-accordion-item>` has a `title`.',
  whenToUse: 'FAQs and long pages where readers only need some sections.',
  alternatives: [
    { name: 'collapsible', when: 'there is a single section with your own trigger.' },
    { name: 'tabs', when: 'exactly one section is visible and they are peers.' },
  ],
  pitfalls: [
    'The heading is the item\'s `title` input, not projected content: `<tolle-accordion-item title="Is it free?">Yes.</tolle-accordion-item>`.',
    '`type="single"` (default) keeps one open at a time; `type="multiple"` allows several.',
  ],
  keywords: ['accordion', 'faq', 'expand', 'collapse', 'disclosure'],
};
