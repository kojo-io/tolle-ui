import type { RegistrySidecar } from '../../../registry/src/types';

export const dropdownMenuRegistry: RegistrySidecar = {
  description:
    'A menu of actions that opens from a trigger. Any element becomes the trigger with `[tolleDropdownTrigger]="menuRef"`.',
  whenToUse: 'A short list of actions behind a button: account menus, row actions, "more" (⋯) buttons.',
  alternatives: [
    { name: 'context-menu', when: 'the menu opens on right-click.' },
    { name: 'menubar', when: 'it is an application menu bar with several top-level menus.' },
    { name: 'select', when: 'the user is choosing a form value, not running an action.' },
    { name: 'popover', when: 'the panel holds arbitrary content such as a small form.' },
  ],
  parts: ['dropdown-item', 'dropdown-label', 'dropdown-separator', 'dropdown-trigger'],
  pitfalls: [
    'Wire it with a template reference: `<tolle-button [tolleDropdownTrigger]="menu">…</tolle-button>` and `<tolle-dropdown-menu #menu>`. Import `DropdownTriggerDirective` as well as the components.',
    'Use `<tolle-dropdown-item (click)="…">` for entries; `<tolle-dropdown-label>` and `<tolle-dropdown-separator>` for structure.',
    'Choosing an enabled item closes the menu (after its `(click)` runs). Keyboard: Enter/Space/↓ on the trigger opens it and focuses the first item; ↑/↓/Home/End move, Escape closes and returns focus.',
  ],
  keywords: ['menu', 'actions', 'more', 'kebab', 'overflow'],
};
