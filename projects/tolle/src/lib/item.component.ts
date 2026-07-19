import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const itemVariants = cva(
  'group/item flex items-center gap-4 rounded-md border text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-transparent',
        outline: 'border-border bg-transparent',
        muted: 'border-transparent bg-muted/50',
      },
      size: {
        xs: 'px-2 py-1.5 gap-2',
        sm: 'px-3 py-2 gap-3',
        default: 'px-4 py-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export type ItemProps = VariantProps<typeof itemVariants>;

/**
 * A flex container for content rows built from media, title, description and
 * actions — profiles, notifications, settings rows, list entries. Use
 * `tolle-field` instead when wrapping a form control.
 * @new
 */
@Component({
  selector: 'tolle-item',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="computedClass"><ng-content></ng-content></div>`,
})
export class ItemComponent {
  /** Visual style of the row. @default 'default' */
  @Input() variant: ItemProps['variant'] = 'default';
  /** Padding and gap density of the row. @default 'default' */
  @Input() size: ItemProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the row via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(itemVariants({ variant: this.variant, size: this.size }), this.class);
  }
}

/** Stacks several `tolle-item` rows as a single list. */
@Component({
  selector: 'tolle-item-group',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div role="list" [class]="cn('flex flex-col', class)"><ng-content></ng-content></div>`,
})
export class ItemGroupComponent {
  /** Extra Tailwind classes merged onto the group via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Leading media slot — avatar, icon, or thumbnail. */
@Component({
  selector: 'tolle-item-media',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="cn('flex shrink-0 items-center justify-center text-muted-foreground', class)"><ng-content></ng-content></div>`,
})
export class ItemMediaComponent {
  /** Extra Tailwind classes merged onto the media slot via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Grows to fill the row; wraps the title and description. */
@Component({
  selector: 'tolle-item-content',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="cn('flex min-w-0 flex-1 flex-col gap-0.5', class)"><ng-content></ng-content></div>`,
})
export class ItemContentComponent {
  /** Extra Tailwind classes merged onto the content column via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Primary line of the row. */
@Component({
  selector: 'tolle-item-title',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p [class]="cn('truncate font-medium leading-none text-foreground', class)"><ng-content></ng-content></p>`,
})
export class ItemTitleComponent {
  /** Extra Tailwind classes merged onto the title via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Secondary line of the row. */
@Component({
  selector: 'tolle-item-description',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p [class]="cn('truncate text-sm text-muted-foreground', class)"><ng-content></ng-content></p>`,
})
export class ItemDescriptionComponent {
  /** Extra Tailwind classes merged onto the description via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Trailing slot for buttons, switches, or badges. */
@Component({
  selector: 'tolle-item-actions',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="cn('flex shrink-0 items-center gap-2', class)"><ng-content></ng-content></div>`,
})
export class ItemActionsComponent {
  /** Extra Tailwind classes merged onto the actions slot via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Optional full-width header above the row's main line. */
@Component({
  selector: 'tolle-item-header',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="cn('flex w-full items-center justify-between gap-2', class)"><ng-content></ng-content></div>`,
})
export class ItemHeaderComponent {
  /** Extra Tailwind classes merged onto the header via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Optional full-width footer below the row's main line. */
@Component({
  selector: 'tolle-item-footer',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="cn('flex w-full items-center justify-between gap-2', class)"><ng-content></ng-content></div>`,
})
export class ItemFooterComponent {
  /** Extra Tailwind classes merged onto the footer via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}
