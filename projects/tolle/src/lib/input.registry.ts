import type { RegistrySidecar } from '../../../registry/src/types';

export const inputRegistry: RegistrySidecar = {
  description:
    'A text input with a built-in label, hint, error message, and `prefix` / `suffix` slots for icons or text.',
  whenToUse: 'Single-line text, email, password, number or search fields.',
  alternatives: [
    { name: 'textarea', when: 'the text spans several lines.' },
    { name: 'input-group', when: 'you need attached buttons or addons beyond a simple prefix/suffix.' },
    { name: 'masked-input', when: 'the value follows a fixed pattern (card number, date).' },
    { name: 'field', when: 'you are laying out a non-input control (switch, select) with a label and error.' },
  ],
  forms: {
    InputComponent: { valueType: 'string', notes: '`type="number"` still writes the raw string; convert it yourself.' },
  },
  pitfalls: [
    'Use the `label`, `hint` and `errorMessage` inputs instead of wrapping it in your own label markup.',
    'Show the error state with `[error]="ctrl.invalid && ctrl.touched"` plus `errorMessage`.',
    'Icons go in slots: `<i prefix class="ri-search-line"></i>` or `<span suffix>kg</span>` inside the tag.',
    'Layout width goes on `containerClass`; `class` styles the inner `<input>`.',
  ],
  keywords: ['text field', 'textbox', 'email', 'password', 'search'],
};
