import { ChangeDetectorRef, Component, Input, HostBinding } from '@angular/core';
import { cn } from './utils/cn';
import { NgIf } from '@angular/common';

@Component({
    selector: 'tolle-avatar',
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
  @Input() src?: string;
  @Input() alt: string = '';
  @Input() size: 'sm' | 'default' | 'lg' | 'xl' = 'default';
  @Input() shape: 'circle' | 'square' = 'circle';

  // We remove @Input() class because standard class="" attributes
  // on the tag will now work automatically with the host bindings.

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
    return cn(
      // Layout & Shape
      "relative flex shrink-0 overflow-hidden bg-muted",
      this.shape === 'circle' ? 'rounded-full' : 'rounded-md',

      // Sizes
      this.size === 'sm' && "h-8 w-8 text-xs",
      this.size === 'default' && "h-10 w-10",
      this.size === 'lg' && "h-16 w-16 text-lg",
      this.size === 'xl' && "h-24 w-24 text-xl"
    );
  }
}
