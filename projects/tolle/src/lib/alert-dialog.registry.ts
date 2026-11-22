import type { RegistrySidecar } from '../../../registry/src/types';

export const alertDialogRegistry: RegistrySidecar = {
  description:
    'A modal confirmation that interrupts the user and waits for a decision. Build it in the template, or open one from code with `AlertDialogService`.',
  whenToUse: 'Confirming destructive or irreversible actions ("Delete project?").',
  alternatives: [
    { name: 'modal', when: 'the dialog holds a form or other rich content.' },
    { name: 'sheet', when: 'the content slides in from the edge.' },
    { name: 'toaster', when: 'you only need to inform, not to ask.' },
  ],
  parts: ['alert-dialog-dynamic'],
  pitfalls: [
    'For a quick confirm, prefer the service: `inject(AlertDialogService).open({ title, description, variant: \'destructive\' }).afterClosed$.subscribe(ok => …)` — `ok` is `true` for the action button.',
    'In templates, `<tolle-alert-dialog-action>` and `<tolle-alert-dialog-cancel>` close the dialog themselves. Put a `<tolle-button>` inside each and handle `(confirmed)` / `(cancelled)`; don\'t also set `open = false`.',
    'Content must be inside `<tolle-alert-dialog-portal>` → `<tolle-alert-dialog-content>`, or it renders inline.',
    '`<tolle-alert-dialog-dynamic>` is what the service renders. Never put it in a template.',
  ],
  keywords: ['confirm', 'confirmation', 'dialog', 'are you sure', 'destructive', 'delete'],
};
