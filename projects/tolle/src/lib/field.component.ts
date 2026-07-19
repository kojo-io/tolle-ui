import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const fieldVariants = cva('group/field flex w-full gap-2 data-[invalid=true]:text-destructive', {
  variants: {
    orientation: {
      vertical: 'flex-col',
      horizontal: 'flex-row items-center justify-between',
      // shadcn uses container queries here, but this preset is Tailwind 3.4 with no
      // container-queries plugin — `@md/...` classes would be silently dropped and the
      // field would never go horizontal. Viewport breakpoints work with the stack we have.
      responsive: 'flex-col md:flex-row md:items-center md:justify-between',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

export type FieldProps = VariantProps<typeof fieldVariants>;

/**
 * Wraps a label, a control and its help/error text into one accessible form
 * field. Composes *around* the existing controls (`tolle-input`,
 * `tolle-select`, …) — it does not replace them.
 *
 * Use `tolle-item` instead when displaying content rather than a form control.
 * @new
 */
@Component({
  selector: 'tolle-field',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div role="group" [attr.data-invalid]="invalid || null" [class]="computedClass">
      <ng-content></ng-content>
    </div>
  `,
})
export class FieldComponent {
  /** Layout direction; `responsive` goes horizontal at the `@md` container width. @default 'vertical' */
  @Input() orientation: FieldProps['orientation'] = 'vertical';
  /** Marks the field invalid, turning on the destructive styling for descendants. @default false */
  @Input() invalid = false;
  /** Extra Tailwind classes merged onto the field via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(fieldVariants({ orientation: this.orientation }), this.class);
  }
}

/**
 * Label for a field's control. Set `for` to the control's `id` so clicking the
 * label focuses it.
 */
@Component({
  selector: 'tolle-field-label',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label
      [attr.for]="for || null"
      [class]="cn(
        'flex items-center gap-2 text-sm font-medium leading-none text-foreground',
        'group-data-[invalid=true]/field:text-destructive',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        class
      )"
    >
      <ng-content></ng-content>
      <span *ngIf="required" class="text-destructive" aria-hidden="true">*</span>
    </label>
  `,
})
export class FieldLabelComponent {
  /** Id of the control this label describes; wire it to the control's `id`. @default '' */
  @Input() for = '';
  /** Appends a required marker (*) after the label text. @default false */
  @Input() required = false;
  /** Extra Tailwind classes merged onto the label via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Column that groups the control with its description and error text. */
@Component({
  selector: 'tolle-field-content',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="cn('flex flex-1 flex-col gap-1.5', class)"><ng-content></ng-content></div>`,
})
export class FieldContentComponent {
  /** Extra Tailwind classes merged onto the content column via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/**
 * Helper text below a control. Give it an `id` and point the control's
 * `aria-describedby` at it.
 */
@Component({
  selector: 'tolle-field-description',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p [id]="id || null" [class]="cn('text-balance text-xs text-muted-foreground', class)">
      <ng-content></ng-content>
    </p>
  `,
})
export class FieldDescriptionComponent {
  /** Id to reference from the control's `aria-describedby`. @default '' */
  @Input() id = '';
  /** Extra Tailwind classes merged onto the description via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/**
 * Error text for a field. Renders nothing when there is no error, so it is safe
 * to leave in the template permanently. Announces via `role="alert"`.
 */
@Component({
  selector: 'tolle-field-error',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      *ngIf="messages.length"
      [id]="id || null"
      role="alert"
      [class]="cn('text-xs font-medium text-destructive', class)"
    >
      <ng-container *ngIf="messages.length === 1">{{ messages[0] }}</ng-container>
      <ul *ngIf="messages.length > 1" class="ml-4 list-disc space-y-0.5">
        <li *ngFor="let message of messages">{{ message }}</li>
      </ul>
    </div>
  `,
})
export class FieldErrorComponent {
  /**
   * Validation message(s). Accepts a single string, an array of strings, or an
   * Angular `ValidationErrors`-style object whose values are messages.
   * @default ''
   */
  @Input() errors: string | string[] | Record<string, any> | null = '';
  /** Id to reference from the control's `aria-describedby`. @default '' */
  @Input() id = '';
  /** Extra Tailwind classes merged onto the error text via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;

  /** Normalises the three accepted `errors` shapes to a flat list of strings. */
  get messages(): string[] {
    const e = this.errors;
    if (!e) return [];
    if (typeof e === 'string') return e ? [e] : [];
    if (Array.isArray(e)) return e.filter(Boolean).map(String);
    return Object.values(e)
      .filter((v) => v !== false && v !== null && v !== undefined)
      .map((v) => (typeof v === 'string' ? v : String(v)));
  }
}

/** Stacks several fields with consistent spacing. */
@Component({
  selector: 'tolle-field-group',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="cn('flex w-full flex-col gap-6', class)"><ng-content></ng-content></div>`,
})
export class FieldGroupComponent {
  /** Extra Tailwind classes merged onto the group via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Semantic `<fieldset>` grouping related fields under a legend. */
@Component({
  selector: 'tolle-field-set',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<fieldset [class]="cn('flex w-full flex-col gap-4 border-0 p-0', class)"><ng-content></ng-content></fieldset>`,
})
export class FieldSetComponent {
  /** Extra Tailwind classes merged onto the fieldset via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

const fieldLegendVariants = cva('mb-1 font-medium text-foreground', {
  variants: {
    variant: {
      legend: 'text-base',
      label: 'text-sm leading-none',
    },
  },
  defaultVariants: { variant: 'legend' },
});

export type FieldLegendProps = VariantProps<typeof fieldLegendVariants>;

/** `<legend>` for a `tolle-field-set`. */
@Component({
  selector: 'tolle-field-legend',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<legend [class]="computedClass"><ng-content></ng-content></legend>`,
})
export class FieldLegendComponent {
  /** Type scale of the legend. @default 'legend' */
  @Input() variant: FieldLegendProps['variant'] = 'legend';
  /** Extra Tailwind classes merged onto the legend via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(fieldLegendVariants({ variant: this.variant }), this.class);
  }
}

/** Divider between sections of a form. */
@Component({
  selector: 'tolle-field-separator',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div role="separator" [class]="cn('h-px w-full bg-border', class)"></div>`,
})
export class FieldSeparatorComponent {
  /** Extra Tailwind classes merged onto the separator via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Title for a group of fields that is not a `<legend>`. */
@Component({
  selector: 'tolle-field-title',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="cn('text-sm font-medium leading-none text-foreground', class)"><ng-content></ng-content></div>`,
})
export class FieldTitleComponent {
  /** Extra Tailwind classes merged onto the title via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}
