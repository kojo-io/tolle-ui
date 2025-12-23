import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkSubject = new BehaviorSubject<boolean>(false);
  isDark$ = this.isDarkSubject.asObservable();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('tolle-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        this.enableDarkMode();
      }
    }
  }

  toggleTheme() {
    if (this.document.documentElement.classList.contains('dark')) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode() {
    this.document.documentElement.classList.add('dark');
    localStorage.setItem('tolle-theme', 'dark');
    this.isDarkSubject.next(true);
  }

  private disableDarkMode() {
    this.document.documentElement.classList.remove('dark');
    localStorage.setItem('tolle-theme', 'light');
    this.isDarkSubject.next(false);
  }
}
