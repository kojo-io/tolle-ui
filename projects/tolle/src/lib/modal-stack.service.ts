import { Injectable, signal, computed } from '@angular/core';
import { ModalRef } from './modal-ref';

@Injectable({ providedIn: 'root' })
export class ModalStackService {
  private _stack = signal<Set<ModalRef>>(new Set<ModalRef>());

  register(ref: ModalRef): void {
    this._stack.update((s: Set<ModalRef>) => {
      s.add(ref);
      return new Set(s);
    });
  }

  unregister(ref: ModalRef): void {
    this._stack.update((s: Set<ModalRef>) => {
      s.delete(ref);
      return new Set(s);
    });
  }

  /** Instantly closes all open modals */
  closeAll(): void {
    const s = this._stack();
    s.forEach((ref: ModalRef) => ref.close());
    this._stack.set(new Set());
  }

  activeCount = computed(() => this._stack().size);
}
