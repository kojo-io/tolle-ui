import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {cn} from './utils/cn';
import {NgIf} from '@angular/common';

@Component({
  selector: 'tolle-avatar',
  standalone: true,
  imports: [
    NgIf
  ],
  template: `
    <div [class]="computedClass">
      <img *ngIf="src && !hasError"
           [src]="src"
           [alt]="alt"
           (load)="onLoad()"
           (error)="onError()"
           [class.opacity-0]="isLoading"
           class="h-full w-full object-cover transition-opacity duration-300" />

      <div *ngIf="hasError || !src || isLoading" class="h-full w-full">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host { display: inline-block; }
  `]
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() alt: string = '';
  @Input() size: 'sm' | 'default' | 'lg' | 'xl' = 'default';
  @Input() shape: 'circle' | 'square' = 'circle';
  @Input() class: string = '';

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

  get computedClass() {
    return cn(
      "relative flex shrink-0 overflow-hidden bg-muted",
      this.shape === 'circle' ? 'rounded-full' : 'rounded-md',
      this.size === 'sm' && "h-8 w-8",
      this.size === 'default' && "h-10 w-10",
      this.size === 'lg' && "h-16 w-16",
      this.size === 'xl' && "h-24 w-24",
      this.class
    );
  }
}
