import { Injectable, signal } from '@angular/core';

@Injectable()
export class RadioService {
  selectedValue = signal<any>(null);
  disabled = signal<boolean>(false);

  select(value: any) {
    if (!this.disabled()) {
      this.selectedValue.set(value);
    }
  }

  setDisabled(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }
}
