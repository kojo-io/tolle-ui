import { Component, input } from '@angular/core';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-button-group',
  standalone: true,
  imports: [],
  template: `
    <div [class]="cn('inline-flex items-center -space-x-px rounded-md shadow-sm', className())">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    /* 1. First Button: Remove right rounding and keep border */
    :host ::ng-deep tolle-button:first-child button {
      @apply rounded-r-none;
    }

    /* 2. Middle Buttons: Remove all rounding and the left border to avoid double-thickness */
    :host ::ng-deep tolle-button:not(:first-child):not(:last-child) button {
      @apply rounded-none border-l-0;
    }

    /* 3. Last Button: Remove left rounding and left border */
    :host ::ng-deep tolle-button:last-child:not(:first-child) button {
      @apply rounded-l-none border-l-0;
    }

    /* 4. Hover/Focus State: Bring the active button to the front so the focus ring isn't cut off */
    :host ::ng-deep tolle-button button:hover,
    :host ::ng-deep tolle-button button:focus {
      @apply z-10 relative;
    }
  `]
})
export class ButtonGroupComponent {
  className = input('', { alias: 'class' });
  protected cn = cn;
}
