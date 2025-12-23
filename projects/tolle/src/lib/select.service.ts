import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SelectService {
  // Emits the value of the clicked item
  private selectedValueSource = new Subject<any>();
  selectedValue$ = this.selectedValueSource.asObservable();

  // Emits the label/text of the clicked item
  private selectedLabelSource = new Subject<string>();
  selectedLabel$ = this.selectedLabelSource.asObservable();

  registerClick(value: any, label: string) {
    this.selectedValueSource.next(value);
    this.selectedLabelSource.next(label);
  }
}
