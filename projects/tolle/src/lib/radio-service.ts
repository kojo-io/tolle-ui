import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable()
export class RadioService {
  private selectedValueSource = new BehaviorSubject<any>(null);
  selectedValue$ = this.selectedValueSource.asObservable();

  private disabledSource = new BehaviorSubject<boolean>(false);
  disabled$ = this.disabledSource.asObservable();

  select(value: any) {
    if (!this.disabledSource.value) {
      this.selectedValueSource.next(value);
    }
  }

  setDisabled(isDisabled: boolean) {
    this.disabledSource.next(isDisabled);
  }
}
