import type { RegistrySidecar } from '../../../registry/src/types';

export const tabsRegistry: RegistrySidecar = {
  description: 'Tabbed panels: a list of triggers that switches between content panels with matching `value`s.',
  whenToUse: 'Several views of the same object where only one needs to be visible at a time.',
  alternatives: [
    { name: 'segment', when: 'you need a compact segmented switch without panels.' },
    { name: 'accordion', when: 'sections should stack vertically and several may be open.' },
  ],
  pitfalls: [
    'Structure: `<tolle-tabs>` → `<tolle-tabs-list>` of `<tolle-tabs-trigger value="a">`, then `<tolle-tabs-content value="a">` per panel. Import all four classes.',
    'Each trigger `value` must match a content `value`.',
    'Use `defaultValue="a"` for uncontrolled tabs, or `[(value)]="tab"` to keep the active tab in your state.',
    '`variant="underline"` goes on `<tolle-tabs-list>`.',
  ],
  keywords: ['tabs', 'tab bar', 'panels', 'views'],
};
