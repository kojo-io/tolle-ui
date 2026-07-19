import { ChangeDetectionStrategy, Component, Input, ChangeDetectorRef, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const shimmerVariants = cva('inline-block max-w-full align-baseline', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      default: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    active: {
      // `.shimmer` is the animated gradient-sweep utility from theme.css.
      true: 'shimmer',
      false: 'text-muted-foreground',
    },
  },
  defaultVariants: { size: 'default', active: true },
});

export type ShimmerProps = VariantProps<typeof shimmerVariants>;

/**
 * Shimmering text for a live, in-progress status — "Thinking…", "Generating
 * response…". While `active` the projected text sweeps with the `.shimmer`
 * utility; when it is false the same text renders plain and static, so the
 * label can stay mounted as the state settles.
 *
 * ```html
 * <tolle-shimmer [active]="isStreaming" size="sm">Generating response…</tolle-shimmer>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-shimmer',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [attr.role]="active ? 'status' : null"
      [attr.aria-live]="active ? 'polite' : null"
      [attr.data-active]="active ? '' : null"
      [class]="computedClass"
    >
      <ng-content></ng-content>
    </span>
  `,
})
export class ShimmerComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Runs the shimmer animation; false renders plain static text. @default true */
  @Input() active = true;
  /** Text size of the label. @default 'default' */
  @Input() size: ShimmerProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the label via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(shimmerVariants({ size: this.size, active: this.active }), this.class);
  }
}
