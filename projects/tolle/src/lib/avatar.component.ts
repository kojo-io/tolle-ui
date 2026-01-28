import { ChangeDetectorRef, Component, input, computed, signal } from '@angular/core';
import { cn } from './utils/cn';


@Component({
  selector: 'tolle-avatar',
  standalone: true,
  imports: [],
  template: `
    <!-- Image Layer -->
    @if (src() && !hasError()) {
      <img
        [src]="src()"
        [alt]="alt()"
        (load)="onLoad()"
        (error)="onError()"
        [class.opacity-0]="isLoading()"
        class="h-full w-full object-cover transition-opacity duration-300" />
    }
    
    <!-- Fallback Layer -->
    @if (hasError() || !src() || isLoading()) {
      <div class="flex h-full w-full items-center justify-center bg-muted">
        <ng-content></ng-content>
      </div>
    }
    `,
  host: {
    '[class]': 'hostClasses()'
  }
})
export class AvatarComponent {
  src = input<string | undefined>();
  alt = input<string>('');
  size = input<'sm' | 'default' | 'lg' | 'xl'>('default');
  shape = input<'circle' | 'square'>('circle');

  isLoading = signal(true);
  hasError = signal(false);

  constructor(private cdr: ChangeDetectorRef) { }

  onLoad() {
    this.isLoading.set(false);
    this.cdr.detectChanges();
  }

  onError() {
    this.isLoading.set(false);
    this.hasError.set(true);
    this.cdr.detectChanges();
  }

  hostClasses = computed(() => {
    return cn(
      // Layout & Shape
      "relative flex shrink-0 overflow-hidden bg-muted",
      this.shape() === 'circle' ? 'rounded-full' : 'rounded-md',

      // Sizes
      this.size() === 'sm' && "h-8 w-8 text-xs",
      this.size() === 'default' && "h-10 w-10",
      this.size() === 'lg' && "h-16 w-16 text-lg",
      this.size() === 'xl' && "h-24 w-24 text-xl"
    );
  });
}
