// projects/tolle/src/lib/toast.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: number;
  title?: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number; // Custom duration in ms
  remainingTime: number;
  isPaused: boolean;
}

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: Toast[] = [];
  private toastSubject = new Subject<Toast[]>();
  toasts$ = this.toastSubject.asObservable();

  constructor() {
    setInterval(() => this.tick(), 100);
  }
  show(toast: Omit<Toast, 'id' | 'remainingTime' | 'isPaused'>) {
    const duration = toast.duration || 3000;
    const newToast: Toast = {
      ...toast,
      id: Date.now(),
      duration,
      remainingTime: duration,
      isPaused: false
    };
    this.toasts.push(newToast);
    this.notify();
  }

  private tick() {
    let changed = false;
    this.toasts.forEach(t => {
      if (!t.isPaused) {
        t.remainingTime -= 100;
        changed = true;
      }
    });

    const initialCount = this.toasts.length;
    this.toasts = this.toasts.filter(t => t.remainingTime > 0);

    if (changed || this.toasts.length !== initialCount) {
      this.notify();
    }
  }

  setPaused(id: number, paused: boolean) {
    const toast = this.toasts.find(t => t.id === id);
    if (toast) {
      toast.isPaused = paused;
      this.notify();
    }
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  private notify() {
    this.toastSubject.next([...this.toasts]);
  }
}
