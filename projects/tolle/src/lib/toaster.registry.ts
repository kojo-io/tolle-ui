import type { RegistrySidecar } from '../../../registry/src/types';

export const toasterRegistry: RegistrySidecar = {
  title: 'Toast',
  description:
    'Brief notifications. Show them with `ToastService.show()`; `<tolle-toaster>` renders the stack, placed once in the app shell.',
  whenToUse: 'Feedback after an action: "Saved", "Copied", "Upload failed".',
  alternatives: [
    { name: 'alert', when: 'the message should stay in the page until dismissed.' },
    { name: 'alert-dialog', when: 'the user must respond.' },
  ],
  pitfalls: [
    'Add `<tolle-toaster position="bottom-right" />` once, in the root component template. Without it `show()` does nothing visible.',
    'Call `inject(ToastService).show({ title: \'Saved\', description: \'Your changes are live.\', variant: \'success\' })`. `description` is required; `duration` is in ms (default 3000).',
    'Variants: `default`, `destructive`, `success`, `warning`, `info`.',
  ],
  keywords: ['toast', 'snackbar', 'notification', 'notify', 'flash message'],
};
