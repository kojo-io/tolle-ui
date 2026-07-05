import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
    selector: 'app-theming-colors',
    imports: [BaseEditorComponent],
    templateUrl: './theming-colors.component.html'
})
export class ThemingColorsComponent {
    primaryGen = `// Example of how Tolle UI generates shades internally
// This happens automatically when you set a primary color

const primary = '#3b82f6'; // Your base color

// Generated Palette
{
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6', // Your Base
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
}`;
}
