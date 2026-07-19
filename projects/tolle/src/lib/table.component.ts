import { Component, Directive, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

/**
 * Unstyled table primitives you compose yourself, for when you need full
 * control over the markup.
 *
 * For sorting, paging, selection and column definitions out of the box, use
 * `tolle-data-table` instead — this is the lower-level building block.
 *
 * Everything below the `<table>` is a **directive on the native element**
 * (`<thead tolleTableHeader>`, `<tr tolleTableRow>`, …) rather than a custom
 * element. A `<tolle-table-row>` wrapper would sit between `<tbody>` and `<tr>`
 * and break the CSS table layout, so the directives style the real elements in
 * place and add no DOM of their own.
 *
 * ```html
 * <tolle-table>
 *   <thead tolleTableHeader>
 *     <tr tolleTableRow><th tolleTableHead>Name</th></tr>
 *   </thead>
 *   <tbody tolleTableBody>
 *     <tr tolleTableRow><td tolleTableCell>Ada</td></tr>
 *   </tbody>
 * </tolle-table>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-table',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cn('relative w-full overflow-x-auto', containerClass)">
      <table [class]="cn('w-full caption-bottom border-collapse text-sm', class)">
        <ng-content></ng-content>
      </table>
    </div>
  `,
})
export class TableComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Extra Tailwind classes merged onto the scrolling container via `cn()` (last-wins). */
  @Input() containerClass = '';
  /** Extra Tailwind classes merged onto the `<table>` via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Styles a native `<thead>`. */
@Directive({
  selector: '[tolleTableHeader]',
  standalone: true,
  host: { '[class]': `cn('[&_tr]:border-b [&_tr]:border-border', class)` },
})
export class TableHeaderDirective {
  /** Extra Tailwind classes merged onto the `<thead>` via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Styles a native `<tbody>`. */
@Directive({
  selector: '[tolleTableBody]',
  standalone: true,
  host: { '[class]': `cn('[&_tr:last-child]:border-0', class)` },
})
export class TableBodyDirective {
  /** Extra Tailwind classes merged onto the `<tbody>` via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Styles a native `<tfoot>` for summary or total rows. */
@Directive({
  selector: '[tolleTableFooter]',
  standalone: true,
  host: { '[class]': `cn('border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0', class)` },
})
export class TableFooterDirective {
  /** Extra Tailwind classes merged onto the `<tfoot>` via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Styles a native `<tr>`, with an optional selected state. */
@Directive({
  selector: '[tolleTableRow]',
  standalone: true,
  host: {
    '[attr.data-state]': `selected ? 'selected' : null`,
    '[class]': `cn('border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', class)`,
  },
})
export class TableRowDirective {
  /** Applies the selected background and sets `data-state="selected"`. @default false */
  @Input() selected = false;
  /** Extra Tailwind classes merged onto the `<tr>` via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Styles a native `<th>` header cell. */
@Directive({
  selector: '[tolleTableHead]',
  standalone: true,
  host: {
    '[attr.scope]': 'scope',
    '[attr.aria-sort]': 'sort',
    '[class]': `cn('h-10 whitespace-nowrap px-3 text-left align-middle font-medium text-muted-foreground', class)`,
  },
})
export class TableHeadDirective {
  /** Scope of the header cell for assistive tech. @default 'col' */
  @Input() scope: 'col' | 'row' | 'colgroup' | 'rowgroup' = 'col';
  /** Current sort direction, surfaced as `aria-sort`. @default null */
  @Input() sort: 'ascending' | 'descending' | 'none' | null = null;
  /** Extra Tailwind classes merged onto the `<th>` via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Styles a native `<td>` data cell. */
@Directive({
  selector: '[tolleTableCell]',
  standalone: true,
  host: { '[class]': `cn('p-3 align-middle', class)` },
})
export class TableCellDirective {
  /** Extra Tailwind classes merged onto the `<td>` via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Styles a native `<caption>`, rendered below the table. */
@Directive({
  selector: '[tolleTableCaption]',
  standalone: true,
  host: { '[class]': `cn('mt-4 text-sm text-muted-foreground', class)` },
})
export class TableCaptionDirective {
  /** Extra Tailwind classes merged onto the `<caption>` via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}
