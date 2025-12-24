import { Injectable } from '@angular/core';
import { ModalRef } from './modal-ref';

@Injectable({ providedIn: 'root' })
export class ModalStackService {
  private _stack = new Set<ModalRef>();

  register(ref: ModalRef): void {
    this._stack.add(ref);
  }

  unregister(ref: ModalRef): void {
    this._stack.delete(ref);
  }

  /** Instantly closes all open modals */
  closeAll(): void {
    this._stack.forEach(ref => ref.close());
    this._stack.clear();
  }

  get activeCount(): number {
    return this._stack.size;
  }
}
