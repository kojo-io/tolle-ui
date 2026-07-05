import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Contract implemented by `tolle-radio-item` so the group/service can drive
 * roving tabindex + arrow-key navigation without importing the component
 * (which would create a circular dependency).
 */
export interface RovingRadioItem {
  value: any;
  isItemDisabled(): boolean;
  hostElement: HTMLElement;
  focusItem(): void;
}

@Injectable()
export class RadioService {
  private selectedValueSource = new BehaviorSubject<any>(null);
  selectedValue$ = this.selectedValueSource.asObservable();

  private disabledSource = new BehaviorSubject<boolean>(false);
  disabled$ = this.disabledSource.asObservable();

  /**
   * The single value that is allowed in the tab order (roving tabindex).
   * It is the selected value, or - when nothing is selected - the first
   * enabled item's value. Recomputed asynchronously so the registry is
   * complete before any item reads it (avoids partial-registry glitches).
   */
  private tabbableValueSource = new BehaviorSubject<any>(undefined);
  tabbableValue$ = this.tabbableValueSource.asObservable();

  /** Registered items in DOM (registration) order. */
  private items: RovingRadioItem[] = [];
  private recomputeScheduled = false;

  get value() {
    return this.selectedValueSource.value;
  }

  select(value: any) {
    if (!this.disabledSource.value) {
      this.selectedValueSource.next(value);
      this.scheduleRecompute();
    }
  }

  setDisabled(isDisabled: boolean) {
    this.disabledSource.next(isDisabled);
    this.scheduleRecompute();
  }

  register(item: RovingRadioItem) {
    if (this.items.indexOf(item) === -1) {
      this.items.push(item);
      this.scheduleRecompute();
    }
  }

  unregister(item: RovingRadioItem) {
    const i = this.items.indexOf(item);
    if (i > -1) {
      this.items.splice(i, 1);
      this.scheduleRecompute();
    }
  }

  /** Ordered, non-disabled items - used for arrow-key navigation. */
  getEnabledItems(): RovingRadioItem[] {
    return this.items.filter(i => !i.isItemDisabled());
  }

  private scheduleRecompute() {
    if (this.recomputeScheduled) return;
    this.recomputeScheduled = true;
    // Defer to a microtask so all items have registered (and the current
    // change-detection pass has completed) before the tabbable value updates.
    Promise.resolve().then(() => {
      this.recomputeScheduled = false;
      this.recomputeTabbable();
    });
  }

  private recomputeTabbable() {
    const selected = this.selectedValueSource.value;
    const selectedItem = this.items.find(i => i.value === selected && !i.isItemDisabled());

    let tabbable: any;
    if (selectedItem) {
      tabbable = selectedItem.value;
    } else {
      const firstEnabled = this.items.find(i => !i.isItemDisabled());
      tabbable = firstEnabled ? firstEnabled.value : undefined;
    }

    if (tabbable !== this.tabbableValueSource.value) {
      this.tabbableValueSource.next(tabbable);
    }
  }
}
