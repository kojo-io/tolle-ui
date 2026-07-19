import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

/**
 * The ⌘K command palette: a `tolle-command` in a centred modal overlay.
 *
 * Project a full command menu inside:
 *
 * ```html
 * <tolle-command-dialog [(open)]="paletteOpen">
 *   <tolle-command (selected)="run($event)">
 *     <tolle-command-input></tolle-command-input>
 *     <tolle-command-list>…</tolle-command-list>
 *   </tolle-command>
 * </tolle-command-dialog>
 * ```
 *
 * Set `shortcut` to bind a global hotkey (default ⌘K / Ctrl+K).
 * @new
 */
@Component({
  selector: 'tolle-command-dialog',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="open"
      class="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-[15vh]"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="ariaLabel"
    >
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
        aria-hidden="true"
        (click)="onBackdropClick()"
      ></div>

      <div
        #panel
        [class]="cn(
          'relative z-10 w-full max-w-lg overflow-hidden rounded-lg border border-border bg-popover shadow-lg',
          class
        )"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class CommandDialogComponent implements OnInit, OnDestroy {
  /** Whether the palette is visible. Supports two-way binding via `[(open)]`. @default false */
  @Input() open = false;
  /**
   * Global hotkey that toggles the palette, as `mod+key` where `mod` maps to ⌘
   * on macOS and Ctrl elsewhere. Set to `''` to disable the binding.
   * @default 'mod+k'
   */
  @Input() shortcut = 'mod+k';
  /** Close the palette when the backdrop is clicked. @default true */
  @Input() closeOnBackdrop = true;
  /** Accessible name for the dialog. @default 'Command palette' */
  @Input() ariaLabel = 'Command palette';
  /** Extra Tailwind classes merged onto the panel via `cn()` (last-wins). */
  @Input() class = '';

  /** Two-way binding partner for `open`. */
  @Output() openChange = new EventEmitter<boolean>();
  /** Emitted when the palette opens. */
  @Output() opened = new EventEmitter<void>();
  /** Emitted when the palette closes. */
  @Output() closed = new EventEmitter<void>();

  @ViewChild('panel') panelEl?: ElementRef<HTMLElement>;

  protected cn = cn;

  constructor(private cdr: ChangeDetectorRef) {}

  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.setOpen(false);
      return;
    }

    if (!this.shortcut) return;
    const parts = this.shortcut.toLowerCase().split('+');
    const key = parts[parts.length - 1];
    const needsMod = parts.includes('mod') || parts.includes('meta') || parts.includes('ctrl');
    const modHeld = event.metaKey || event.ctrlKey;

    if (event.key.toLowerCase() === key && (!needsMod || modHeld)) {
      event.preventDefault();
      this.setOpen(!this.open);
    }
  };

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKeyDown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) this.setOpen(false);
  }

  private setOpen(next: boolean): void {
    if (this.open === next) return;
    this.open = next;
    this.openChange.emit(next);
    (next ? this.opened : this.closed).emit();
    this.cdr.markForCheck();

    if (next) {
      // Focus the projected search box once the panel is in the DOM, so typing
      // works immediately on open.
      setTimeout(() => this.panelEl?.nativeElement.querySelector('input')?.focus());
    }
  }
}
