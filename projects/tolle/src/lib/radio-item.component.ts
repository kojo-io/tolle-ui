import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';
import { RadioService } from './radio-service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'tolle-radio-item',
    imports: [CommonModule],
    template: `
    <div
      (click)="!isEffectiveDisabled && select()"
      [class]="cn(
        'flex items-center space-x-2 group py-1',
        isEffectiveDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      )"
    >
      <div [class]="cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary transition-all flex items-center justify-center',
        'ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        !isEffectiveDisabled && 'group-hover:border-primary/70',
        isSelected ? 'bg-background' : 'bg-transparent',
        class
      )">
        <div
          *ngIf="isSelected"
          class="h-2.5 w-2.5 rounded-full bg-primary animate-in zoom-in-50 duration-200"
        ></div>
      </div>

      <label class="text-sm font-medium leading-none select-none" [class.cursor-pointer]="!isEffectiveDisabled">
        <ng-content></ng-content>
      </label>
    </div>
  `
})
export class RadioItemComponent implements OnInit, OnDestroy {
  @Input() value: any;
  @Input() disabled = false;
  @Input() class = '';

  isSelected = false;
  groupDisabled = false;

  private sub = new Subscription();

  get isEffectiveDisabled(): boolean {
    return this.disabled || this.groupDisabled;
  }

  // Inject ChangeDetectorRef to ensure UI updates when service emits
  constructor(
    private radioService: RadioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Listen for selection changes
    this.sub.add(
      this.radioService.selectedValue$.subscribe(val => {
        this.isSelected = (val === this.value);
        this.cdr.markForCheck(); // Trigger UI refresh
      })
    );

    // Listen for group-level disabled state
    this.sub.add(
      this.radioService.disabled$.subscribe(dis => {
        this.groupDisabled = dis;
        this.cdr.markForCheck(); // Trigger UI refresh
      })
    );
  }

  select() {
    this.radioService.select(this.value);
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); // Clean up subscriptions
  }

  protected cn = cn;
}
