import type { RegistrySidecar } from '../../../registry/src/types';

export const cardRegistry: RegistrySidecar = {
  description: 'A bordered surface for grouping content, with optional header, title, description, content and footer parts.',
  whenToUse: 'Dashboards, settings sections, list items with actions — any boxed group of content.',
  alternatives: [{ name: 'item', when: 'you are building dense list rows with media and actions.' }],
  pitfalls: [
    'Use the parts for consistent spacing: `<tolle-card-header>` (with `-title` / `-description`), `<tolle-card-content>`, `<tolle-card-footer>`. Each part is its own import.',
    'Set width on the card (`class="w-[380px]"`); it does not size itself.',
  ],
  keywords: ['card', 'panel', 'box', 'surface', 'tile'],
};
