import type { RegistrySidecar } from '../../../registry/src/types';

export const nativeSelectRegistry: RegistrySidecar = {
  description: 'A styled native `<select>` built from an `[options]` array; uses the platform picker.',
  whenToUse: 'Mobile-first forms, very long lists, or anywhere the OS picker is preferable to a custom dropdown.',
  alternatives: [
    { name: 'select', when: 'you need custom option content, search, or groups rendered by Tolle.' },
    { name: 'combobox', when: 'the user should type to filter.' },
  ],
  pitfalls: [
    'Prefer `[options]` (`NativeSelectOption[]`): the bound value keeps its original type (number, object). Projected `<option>` children also work, but their values are always strings.',
    'Give it a visible `label` (or `ariaLabel` when there is none). Its error flag is `[invalid]`, paired with `errorMessage`.',
  ],
  keywords: ['select', 'dropdown', 'mobile', 'native'],
};
