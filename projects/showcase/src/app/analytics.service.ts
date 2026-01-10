import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private router: Router) {}

  init() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        window.gtag('config', 'G-BXX9QLERNW', {
          page_path: event.urlAfterRedirects
        });
      });
  }
}
