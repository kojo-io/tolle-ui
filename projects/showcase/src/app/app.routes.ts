import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/landing.component').then(c => c.LandingComponent),
  },
  {
    // The original kitchen-sink component demo, preserved.
    path: 'demo',
    loadComponent: () => import('./index/index.component').then(c => c.IndexComponent),
  },
];
