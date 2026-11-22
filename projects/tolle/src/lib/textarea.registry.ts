import type { RegistrySidecar } from '../../../registry/src/types';

export const textareaRegistry: RegistrySidecar = {
  description: 'A multi-line text input with a built-in label, hint, error message, character count and auto-grow.',
  whenToUse: 'Comments, descriptions, messages — any free text longer than one line.',
  alternatives: [
    { name: 'input', when: 'the value is a single line.' },
    { name: 'prompt-input', when: 'it is a chat composer with submit and tools.' },
  ],
  forms: {
    TextareaComponent: { valueType: 'string' },
  },
  pitfalls: [
    'Extra classes go on `className`, not `class` — this is the one form control that differs.',
    '`[showCharacterCount]="true"` only counts against `maxLength` when you also set `[maxLength]`.',
  ],
  keywords: ['multiline', 'comment', 'message', 'text area'],
};
