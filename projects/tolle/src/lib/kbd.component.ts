import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const kbdVariants = cva(
  'inline-flex select-none items-center justify-center gap-1 rounded border border-border font-mono font-medium text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'h-4 min-w-4 px-1 text-[10px]',
        default: 'h-5 min-w-5 px-1.5 text-[11px]',
        lg: 'h-6 min-w-6 px-2 text-xs',
      },
      variant: {
        default: 'bg-muted',
        outline: 'bg-transparent',
      },
    },
    defaultVariants: { size: 'default', variant: 'default' },
  }
);

export type KbdProps = VariantProps<typeof kbdVariants>;

/**
 * Renders a keyboard key or shortcut, e.g. `<tolle-kbd>⌘</tolle-kbd>`.
 * Pairs with `tolle-command-shortcut` inside command menus.
 * @new
 */
@Component({
  selector: 'tolle-kbd',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<kbd [class]="computedClass"><ng-content></ng-content></kbd>`,
})
export class KbdComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Size of the key cap. @default 'default' */
  @Input() size: KbdProps['size'] = 'default';
  /** Visual style of the key cap. @default 'default' */
  @Input() variant: KbdProps['variant'] = 'default';
  /** Extra Tailwind classes merged onto the key cap via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(kbdVariants({ size: this.size, variant: this.variant }), this.class);
  }
}

/**
 * Groups several `tolle-kbd` keys into one shortcut, e.g. ⌘ + K.
 */
@Component({
  selector: 'tolle-kbd-group',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="cn('inline-flex items-center gap-1', class)"><ng-content></ng-content></span>`,
})
export class KbdGroupComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Extra Tailwind classes merged onto the group via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}
