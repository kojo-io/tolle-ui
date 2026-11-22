import type { RegistrySidecar } from '../../../registry/src/types';

export const sheetRegistry: RegistrySidecar = {
  description:
    'A panel that slides in from an edge of the screen. Compose it in the template, or open one from code with `SheetService`.',
  whenToUse: 'Side panels for editing, filters, navigation on mobile, or details that keep the page in context.',
  alternatives: [
    { name: 'modal', when: 'the content should be centred over the page.' },
    { name: 'sidebar', when: 'the panel is permanent app navigation.' },
  ],
  parts: ['sheet-wrapper'],
  pitfalls: [
    'Choose the edge on `<tolle-sheet-content side="left|right|top|bottom">`, not on `<tolle-sheet>`.',
    'Close it from code with `[(isOpen)]` on `<tolle-sheet>`.',
    'From code: `inject(SheetService).open({ title, description, content, side })` returns a `SheetRef` with `close()` / `afterClosed$`.',
    '`<tolle-sheet-wrapper>` is what the service renders. Don\'t use it in templates.',
  ],
  keywords: ['drawer', 'side panel', 'slide over', 'offcanvas'],
};
