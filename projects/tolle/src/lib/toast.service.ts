import { Injectable, signal } from '@angular/core';

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
  toasts = signal<Toast[]>([]);

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
    this.toasts.update((current: Toast[]) => [...current, newToast]);
  }

  private tick() {
    let changed = false;
    const currentToasts = this.toasts();

    const nextToasts = currentToasts.map(t => {
      if (!t.isPaused) {
        changed = true;
        return { ...t, remainingTime: t.remainingTime - 100 };
      }
      return t;
    }).filter((t: Toast) => t.remainingTime > 0);

    if (changed || nextToasts.length !== currentToasts.length) {
      this.toasts.set(nextToasts);
    }
  }

  setPaused(id: number, paused: boolean) {
    this.toasts.update(current =>
      current.map(t => t.id === id ? { ...t, isPaused: paused } : t)
    );
  }

  remove(id: number) {
    this.toasts.update((current: Toast[]) => current.filter((t: Toast) => t.id !== id));
  }
}
