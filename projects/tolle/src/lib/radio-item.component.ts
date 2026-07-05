import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';
import { RadioService, RovingRadioItem } from './radio-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tolle-radio-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      (click)="!isEffectiveDisabled && select()"
      [class]="cn(
        'flex items-center space-x-2 group py-1',
        isEffectiveDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      )"
    >
      <div
        role="radio"
        [attr.aria-checked]="isSelected"
        [attr.aria-disabled]="isEffectiveDisabled || null"
        [attr.data-state]="isSelected ? 'checked' : 'unchecked'"
        [attr.tabindex]="isEffectiveDisabled ? -1 : (isTabbable ? 0 : -1)"
        (keydown.enter)="isEffectiveDisabled ? null : select()"
        (keydown.space)="isEffectiveDisabled ? null : select(); $event.preventDefault()"
        [class]="cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary transition-all flex items-center justify-center',
        'outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
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
export class RadioItemComponent implements OnInit, OnDestroy, RovingRadioItem {
  @Input() value: any;
  @Input() disabled = false;
  @Input() class = '';

  isSelected = false;
  groupDisabled = false;
  /** Whether this item is the single roving tab stop for the group. */
  isTabbable = false;

  private sub = new Subscription();

  get isEffectiveDisabled(): boolean {
    return this.disabled || this.groupDisabled;
  }

  // Inject ChangeDetectorRef to ensure UI updates when service emits
  constructor(
    private radioService: RadioService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef<HTMLElement>
  ) {}

  // --- RovingRadioItem contract (used by the group/service for keyboard nav) ---
  get hostElement(): HTMLElement {
    return this.el.nativeElement;
  }

  isItemDisabled(): boolean {
    return this.isEffectiveDisabled;
  }

  focusItem(): void {
    const radioEl = this.el.nativeElement.querySelector('[role="radio"]') as HTMLElement | null;
    radioEl?.focus();
  }

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

    // Listen for roving tabindex changes (which single item is tab-reachable)
    this.sub.add(
      this.radioService.tabbableValue$.subscribe(val => {
        this.isTabbable = (val === this.value);
        this.cdr.markForCheck(); // Trigger UI refresh
      })
    );

    this.radioService.register(this);
  }

  select() {
    this.radioService.select(this.value);
  }

  ngOnDestroy() {
    this.radioService.unregister(this);
    this.sub.unsubscribe(); // Clean up subscriptions
  }

  protected cn = cn;
}
