import { Component, input, computed, inject, ChangeDetectorRef } from '@angular/core';

import { cn } from './utils/cn';
import { RadioService } from './radio-service';

@Component({
  selector: 'tolle-radio-item',
  standalone: true,
  imports: [],
  template: `
    <div
      (click)="!isEffectiveDisabled() && select()"
      [class]="cn(
        'flex items-center space-x-2 group py-1',
        isEffectiveDisabled() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      )"
      >
      <div [class]="cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary transition-all flex items-center justify-center',
        'ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        !isEffectiveDisabled() && 'group-hover:border-primary/70',
        isSelected() ? 'bg-background' : 'bg-transparent',
        class()
      )">
        @if (isSelected()) {
          <div
            class="h-2.5 w-2.5 rounded-full bg-primary animate-in zoom-in-50 duration-200"
          ></div>
        }
      </div>
    
      <label class="text-sm font-medium leading-none select-none" [class.cursor-pointer]="!isEffectiveDisabled()">
        <ng-content></ng-content>
      </label>
    </div>
  `
})
export class RadioItemComponent {
  value = input<any>();
  disabled = input(false);
  class = input('');

  private radioService = inject(RadioService);
  private cdr = inject(ChangeDetectorRef);

  isSelected = computed(() => this.radioService.selectedValue() === this.value());
  groupDisabled = computed(() => this.radioService.disabled());

  isEffectiveDisabled = computed(() => this.disabled() || this.groupDisabled());

  select() {
    this.radioService.select(this.value());
    this.cdr.markForCheck();
  }

  protected cn = cn;
}
