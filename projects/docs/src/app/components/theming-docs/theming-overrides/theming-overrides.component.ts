import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
    selector: 'app-theming-overrides',
    standalone: true,
    imports: [BaseEditorComponent],
    templateUrl: './theming-overrides.component.html'
})
export class ThemingOverridesComponent {
    baseOverride = `/* Global override for specific component */
.tolle-segment {
    @apply rounded-none border-b border-primary-500 bg-transparent;
}

.tolle-segment-item {
    @apply rounded-none px-6;
}

.tolle-segment-item[data-state='active'] {
    @apply bg-primary-100 text-primary-900 shadow-none border-b-2 border-primary-600;
}`;

    baseDarkOverride = `.dark .tolle-segment {
    @apply border-primary-400;
}

.dark .tolle-segment-item[data-state='active'] {
    @apply bg-primary-900/50 text-primary-100 border-primary-400;
}`;

    baseDarkOverride2 = `.tolle-sidebar-item:hover .tolle-icon {
   @apply text-primary-500 scale-110 transition-transform;
}

/* Target the 3rd button in a group */
.tolle-button-group button:nth-child(3) {
   @apply border-l-2 border-red-500;
}`;
}
