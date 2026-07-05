import { Injectable, signal } from '@angular/core';

@Injectable()
export class SelectService {
  // Stores the currently selected value
  selectedValue = signal<any>(null);

  // Stores the label/text of the selected item
  selectedLabel = signal<string>('');

  registerClick(value: any, label: string) {
    this.selectedValue.set(value);
    this.selectedLabel.set(label);
  }
}
