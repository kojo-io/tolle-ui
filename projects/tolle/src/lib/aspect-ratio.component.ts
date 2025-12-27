import { Component, Input, HostBinding, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-aspect-ratio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="cn('relative w-full overflow-hidden bg-muted/20', class)"
      [style.aspect-ratio]="ratio"
      (load)="onLoad()"
      (error)="onError()"
    >
      <div *ngIf="isLoading && !hasError" class="absolute inset-0 z-10 animate-pulse bg-muted flex items-center justify-center">
        <i class="ri-image-line text-muted-foreground/40 text-3xl"></i>
      </div>

      <div *ngIf="hasError" class="absolute inset-0 z-20 bg-secondary flex flex-col items-center justify-center gap-2">
        <i class="ri-image-warning-line text-destructive text-2xl"></i>
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Failed to load</span>
      </div>

      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    /* Target elements projected into the ng-content */
    :host ::ng-deep img,
    :host ::ng-deep video,
    :host ::ng-deep iframe {
      position: absolute;
      height: 100%;
      width: 100%;
      inset: 0;
      object-fit: cover;
      transition: opacity 0.3s ease-in-out;
    }

    /* Target direct div wrappers if needed */
    :host ::ng-deep .aspect-ratio-content {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class AspectRatioComponent {
  @Input() ratio: string | number = '16 / 9';
  @Input() class: string = '';

  isLoading = true;
  hasError = false;

  constructor(private cdr: ChangeDetectorRef) {}

  // Using event capture to detect load/error on child img/video
  onLoad() {
    this.isLoading = false;
    this.hasError = false;
    this.cdr.detectChanges();
  }

  onError() {
    this.isLoading = false;
    this.hasError = true;
    this.cdr.detectChanges();
  }

  protected cn = cn;
}
