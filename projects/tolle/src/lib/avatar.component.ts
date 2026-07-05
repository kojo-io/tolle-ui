import { ChangeDetectorRef, Component, Input, HostBinding } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';
import { NgIf } from '@angular/common';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden bg-muted',
  {
    variants: {
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md',
      },
      size: {
        sm: 'h-8 w-8 text-xs',
        default: 'h-10 w-10',
        lg: 'h-16 w-16 text-lg',
        xl: 'h-24 w-24 text-xl',
      },
    },
    defaultVariants: {
      shape: 'circle',
      size: 'default',
    },
  }
);

export type AvatarProps = VariantProps<typeof avatarVariants>;

@Component({
  selector: 'tolle-avatar',
  standalone: true,
  imports: [NgIf],
  template: `
    <!-- Image Layer -->
    <img *ngIf="src && !hasError"
         [src]="src"
         [alt]="alt"
         (load)="onLoad()"
         (error)="onError()"
         [class.opacity-0]="isLoading"
         class="h-full w-full object-cover transition-opacity duration-300" />

    <!-- Fallback Layer -->
    <div *ngIf="hasError || !src || isLoading" class="flex h-full w-full items-center justify-center bg-muted">
      <ng-content></ng-content>
    </div>
  `
})
export class AvatarComponent {
  /** Image URL. When absent or failed to load, projected fallback content is shown. */
  @Input() src?: string;
  /** Alternative text for the avatar image. @default '' */
  @Input() alt: string = '';
  /** Size of the avatar. @default 'default' */
  @Input() size: AvatarProps['size'] = 'default';
  /** Shape of the avatar. @default 'circle' */
  @Input() shape: AvatarProps['shape'] = 'circle';
  /** Extra Tailwind classes merged onto the avatar via `cn()` (last-wins). */
  @Input() class = '';

  isLoading = true;
  hasError = false;

  constructor(private cdr: ChangeDetectorRef) {}

  onLoad() {
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  onError() {
    this.isLoading = false;
    this.hasError = true;
    this.cdr.detectChanges();
  }

  // Apply styles directly to the <tolle-avatar> tag
  @HostBinding('class')
  get hostClasses() {
    return cn(avatarVariants({ shape: this.shape, size: this.size }), this.class);
  }
}
