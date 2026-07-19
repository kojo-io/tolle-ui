import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      blockquote: 'mt-6 border-l-2 border-border pl-6 italic',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
    },
  },
  defaultVariants: { variant: 'p' },
});

export type TypographyProps = VariantProps<typeof typographyVariants>;

/**
 * Applies the theme's type scale to projected content. Renders the semantically
 * correct host tag for the chosen `variant` (`h1`–`h4`, `blockquote`, `code`,
 * otherwise `p`), so headings stay real headings for assistive tech.
 * @new
 */
@Component({
  selector: 'tolle-typography',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // `<ng-content>` may only appear once — a duplicated slot per branch would leave
  // every branch but the first empty. Project once into a template and stamp that
  // template into whichever tag the variant selects.
  template: `
    <ng-template #body><ng-content></ng-content></ng-template>

    <h1 *ngIf="variant === 'h1'" [class]="computedClass"><ng-container *ngTemplateOutlet="body"></ng-container></h1>
    <h2 *ngIf="variant === 'h2'" [class]="computedClass"><ng-container *ngTemplateOutlet="body"></ng-container></h2>
    <h3 *ngIf="variant === 'h3'" [class]="computedClass"><ng-container *ngTemplateOutlet="body"></ng-container></h3>
    <h4 *ngIf="variant === 'h4'" [class]="computedClass"><ng-container *ngTemplateOutlet="body"></ng-container></h4>
    <blockquote *ngIf="variant === 'blockquote'" [class]="computedClass"><ng-container *ngTemplateOutlet="body"></ng-container></blockquote>
    <code *ngIf="variant === 'code'" [class]="computedClass"><ng-container *ngTemplateOutlet="body"></ng-container></code>
    <p *ngIf="isParagraph" [class]="computedClass"><ng-container *ngTemplateOutlet="body"></ng-container></p>
  `,
})
export class TypographyComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Type scale step; also selects the rendered HTML tag. @default 'p' */
  @Input() variant: TypographyProps['variant'] = 'p';
  /** Extra Tailwind classes merged onto the element via `cn()` (last-wins). */
  @Input() class = '';

  /** True for the variants that have no dedicated tag and render as `<p>`. */
  get isParagraph() {
    return !['h1', 'h2', 'h3', 'h4', 'blockquote', 'code'].includes(this.variant ?? 'p');
  }

  get computedClass() {
    return cn(typographyVariants({ variant: this.variant }), this.class);
  }
}
