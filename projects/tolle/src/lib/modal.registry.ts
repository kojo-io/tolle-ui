import type { RegistrySidecar } from '../../../registry/src/types';

export const modalRegistry: RegistrySidecar = {
  description:
    'A dialog opened from code with `ModalService.open()`, showing a string, a template or a component, with sizes from `xs` to `fullscreen`.',
  whenToUse: 'Forms and rich content that should sit above the page: edit dialogs, detail views, wizards.',
  alternatives: [
    { name: 'alert-dialog', when: 'you only need a yes/no confirmation.' },
    { name: 'sheet', when: 'the panel should slide in from an edge.' },
    { name: 'popover', when: 'the content is small and anchored to its trigger.' },
  ],
  pitfalls: [
    'Never write `<tolle-modal>` in a template — `ModalService.open({ title, content })` creates it. `content` is a string, a `TemplateRef` or a component class.',
    'A component shown in a modal closes itself with `inject(ModalRef).close(result)`; the opener gets the result from `ref.afterClosed$`.',
    '`data` keys that match the content component\'s `@Input()`s are bound to them (`data: { userId: 7 }` → `@Input() userId`); other keys are skipped, and every key stays readable via `inject(ModalRef).modal.data`. For a `TemplateRef`, pass `context` and read it with `let-`.',
    'Set `backdropClose: false` for blocking dialogs; it also disables Escape.',
  ],
  keywords: ['dialog', 'popup', 'overlay', 'modal window'],
};
