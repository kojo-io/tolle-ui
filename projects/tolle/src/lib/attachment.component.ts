import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const attachmentVariants = cva(
  'group/attachment relative flex w-full max-w-xs items-center gap-3 overflow-hidden rounded-lg border text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      state: {
        idle: 'border-border bg-card text-card-foreground hover:bg-accent',
        uploading: 'border-border bg-card text-card-foreground',
        error: 'border-destructive bg-destructive/10 text-foreground',
      },
      size: {
        sm: 'gap-2 p-1.5 text-xs',
        default: 'gap-3 p-2 text-sm',
      },
    },
    defaultVariants: { state: 'idle', size: 'default' },
  }
);

export type AttachmentProps = VariantProps<typeof attachmentVariants>;

/**
 * A file or image attached to a chat message, with an upload state and an
 * optional progress bar. Wrap several in `tolle-attachment-group`.
 * @new
 */
@Component({
  selector: 'tolle-attachment',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="computedClass"
      role="button"
      tabindex="0"
      [attr.aria-label]="name"
      (click)="onOpen($event)"
      (keydown.enter)="onOpen($event)"
      (keydown.space)="onOpen($event)">
      <img
        *ngIf="isImage; else fileIcon"
        [src]="url"
        [alt]="name"
        class="size-10 shrink-0 rounded-md object-cover" />

      <ng-template #fileIcon>
        <span class="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <i [class]="iconClass" aria-hidden="true"></i>
        </span>
      </ng-template>

      <span class="flex min-w-0 flex-1 flex-col gap-0.5">
        <span class="truncate font-medium leading-none">{{ name }}</span>

        <span class="truncate text-xs text-muted-foreground">
          <ng-container *ngIf="state === 'error'; else metaText">{{ errorLabel }}</ng-container>
          <ng-template #metaText>{{ formattedSize }}</ng-template>
        </span>

        <span
          *ngIf="state === 'uploading'"
          class="mt-1 block h-1 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          [attr.aria-valuenow]="clampedProgress">
          <span
            class="block h-full rounded-full bg-primary transition-all"
            [style.width.%]="clampedProgress"></span>
        </span>
      </span>

      <button
        *ngIf="removable"
        type="button"
        [attr.aria-label]="removeLabel"
        (click)="onRemove($event)"
        class="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>

      <ng-content></ng-content>
    </div>
  `,
})
export class AttachmentComponent {
  /** File name shown as the card's title. */
  @Input() name = '';
  /** File size in bytes; rendered as B / KB / MB. @default 0 */
  @Input() size = 0;
  /** MIME type, e.g. 'image/png'. Chooses the thumbnail or the file icon. */
  @Input() type = '';
  /** Source for the thumbnail and the target of `open`. */
  @Input() url = '';
  /** Upload lifecycle state of the attachment. @default 'idle' */
  @Input() state: AttachmentProps['state'] = 'idle';
  /** Upload progress from 0 to 100; only shown while uploading. @default 0 */
  @Input() progress = 0;
  /** Density of the card. @default 'default' */
  @Input() density: AttachmentProps['size'] = 'default';
  /** Shows a trailing remove button that emits `remove`. @default false */
  @Input() removable = false;
  /** Accessible label for the remove button. @default 'Remove attachment' */
  @Input() removeLabel = 'Remove attachment';
  /** Text shown in place of the size when the state is 'error'. @default 'Upload failed' */
  @Input() errorLabel = 'Upload failed';
  /** Extra Tailwind classes merged onto the card via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted when the remove button is pressed. */
  @Output() remove = new EventEmitter<Event>();
  /** Emitted when the card is activated by click, Enter, or Space. */
  @Output() open = new EventEmitter<Event>();

  get computedClass(): string {
    return cn(attachmentVariants({ state: this.state, size: this.density }), this.class);
  }

  /** Whether the attachment renders as an image thumbnail rather than a file icon. */
  get isImage(): boolean {
    return this.type.startsWith('image/') && !!this.url;
  }

  /** Remixicon class picked from the MIME type. */
  get iconClass(): string {
    return this.iconForType(this.type);
  }

  /** The `size` input rendered for display, e.g. 1536 becomes "1.5 KB". */
  get formattedSize(): string {
    return this.formatBytes(this.size);
  }

  /** `progress` constrained to the 0-100 the progress bar can render. */
  get clampedProgress(): number {
    if (!Number.isFinite(this.progress)) return 0;
    return Math.min(100, Math.max(0, this.progress));
  }

  private formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes < 0) return '';
    if (bytes < 1024) return bytes + ' B';

    const units = ['KB', 'MB', 'GB', 'TB'];
    let value = bytes / 1024;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
      value /= 1024;
      unit++;
    }

    // One decimal, with a trailing ".0" dropped: 1536 -> "1.5 KB", 2048 -> "2 KB".
    return Math.round(value * 10) / 10 + ' ' + units[unit];
  }

  private iconForType(type: string): string {
    if (type.startsWith('image/')) return 'ri-image-line';
    if (type.startsWith('video/')) return 'ri-film-line';
    if (type.startsWith('audio/')) return 'ri-music-2-line';
    if (type === 'application/pdf') return 'ri-file-pdf-line';
    if (type.startsWith('text/')) return 'ri-file-text-line';
    if (type.includes('zip') || type.includes('compressed') || type.includes('tar')) {
      return 'ri-file-zip-line';
    }
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) {
      return 'ri-file-excel-line';
    }
    return 'ri-file-line';
  }

  protected onRemove(event: Event): void {
    // The card itself is a trigger; a remove click must not also open it.
    event.stopPropagation();
    this.remove.emit(event);
  }

  protected onOpen(event: Event): void {
    if (event.type === 'keydown') event.preventDefault();
    this.open.emit(event);
  }
}

/** Wrapping row of attachment cards below or above a message. */
@Component({
  selector: 'tolle-attachment-group',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="cn('flex flex-wrap items-start gap-2', class)"><ng-content></ng-content></div>`,
})
export class AttachmentGroupComponent {
  /** Extra Tailwind classes merged onto the row via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/**
 * Trailing slot for attachment controls — download, retry, remove. Clicks are
 * kept inside the slot so the card's own trigger does not also fire.
 */
@Component({
  selector: 'tolle-attachment-actions',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass" (click)="onClick($event)">
      <ng-content></ng-content>
    </div>
  `,
})
export class AttachmentActionsComponent {
  /** Keeps the actions visible instead of revealing them on hover or focus. @default false */
  @Input() alwaysVisible = false;
  /** Extra Tailwind classes merged onto the slot via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass(): string {
    return cn(
      'flex shrink-0 items-center gap-1 transition-opacity',
      this.alwaysVisible
        ? 'opacity-100'
        : 'opacity-0 focus-within:opacity-100 group-hover/attachment:opacity-100',
      this.class
    );
  }

  protected onClick(event: Event): void {
    event.stopPropagation();
  }
}
