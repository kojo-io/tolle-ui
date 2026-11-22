import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { cn } from './utils/cn';

/**
 * The label / hint / error trio every Tolle form control offers, so a
 * component gets `label`, `hint` and `errorMessage` with the same look and
 * ARIA wiring as `tolle-input` instead of a copy of its markup.
 *
 * Usage inside a control's template (host must be `display: block`):
 *
 *   @if (label) { <tolle-form-control-label [for]="id" [disabled]="disabled">{{ label }}</tolle-form-control-label> }
 *   …the control, with [attr.aria-describedby]="describedBy(id, hint, errorMessage, invalid, disabled)"…
 *   @if (hasMessage(hint, errorMessage, invalid, disabled)) { <tolle-form-control-message … /> }
 */

/** `aria-describedby` for a control: the visible error, else the visible hint. */
export function describedBy(
  id: string,
  hint: string | null | undefined,
  errorMessage: string | null | undefined,
  error: boolean,
  disabled = false
): string | null {
  if (disabled) return null;
  if (error) return errorMessage ? `${id}-error` : null;
  return hint ? `${id}-hint` : null;
}

/** Whether `<tolle-form-control-message>` would show anything. */
export function hasMessage(
  hint: string | null | undefined,
  errorMessage: string | null | undefined,
  error: boolean,
  disabled = false
): boolean {
  return describedBy('_', hint, errorMessage, error, disabled) !== null;
}

/**
 * Label above a form control. Uses `for` when the control's focusable element
 * is labelable (button, input, select); otherwise give it `labelId` and point
 * the control's `aria-labelledby` at it.
 * @internal
 */
@Component({
  selector: 'tolle-form-control-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; margin-bottom: 0.375rem; }'],
  template: `
    <label [attr.for]="for || null" [attr.id]="labelId || null" [class]="computedClass">
      <ng-content></ng-content>
    </label>
  `,
})
export class FormControlLabelComponent {
  /** Id of the labelable element inside the control. */
  @Input() for = '';
  /** Id for `aria-labelledby` when the control is not labelable (slider thumbs, radio group). */
  @Input() labelId = '';
  @Input() disabled = false;

  get computedClass() {
    return cn(
      'text-sm font-medium text-foreground leading-none transition-opacity duration-200',
      this.disabled && 'opacity-50'
    );
  }
}

/**
 * Hint or error text below a form control, with the ids `describedBy()` returns.
 * @internal
 */
@Component({
  selector: 'tolle-form-control-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; margin-top: 0.375rem; }'],
  template: `
    @if (error) {
      @if (errorMessage) {
        <p [id]="controlId + '-error'" class="px-1 text-xs text-destructive">{{ errorMessage }}</p>
      }
    } @else if (hint) {
      <p [id]="controlId + '-hint'" class="px-1 text-xs text-muted-foreground">{{ hint }}</p>
    }
  `,
})
export class FormControlMessageComponent {
  @Input() controlId = '';
  @Input() hint = '';
  @Input() errorMessage = '';
  @Input() error = false;
}
