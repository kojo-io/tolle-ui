import type { RegistrySidecar } from '../../../registry/src/types';

export const otpRegistry: RegistrySidecar = {
  description: 'A one-time-code input split into single-character slots; the value is the whole code as a string.',
  whenToUse: 'Verification codes, PINs, and other fixed-length short codes.',
  parts: ['otp-group', 'otp-slot'],
  forms: {
    OtpComponent: { valueType: 'string', notes: 'The value is the full code, e.g. `"123456"`.' },
  },
  pitfalls: [
    'Set `[auto]="true"` to have it render its own slots: `<tolle-otp [length]="6" [auto]="true" [(ngModel)]="code">`. With the default `auto=false` nothing is visible until you project `<tolle-otp-group>` / `<tolle-otp-slot>` yourself — do that only for a custom layout (e.g. 3 + 3 with a separator).',
    'React to a completed code with `(ngModelChange)` and check `code.length === length`; there is no complete event.',
  ],
  keywords: ['otp', 'pin', 'code', 'verification', '2fa'],
};
