import { Routes } from '@angular/router';
import {DocLayoutComponent} from './layout/doc-layout/doc-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: DocLayoutComponent,
    children: [
      {
        path: 'getting-started',
        loadComponent: () => import('./getting-started/getting-started.component').then(m => m.GettingStartedComponent),
      },
      {
        path: 'installation',
        loadComponent: () => import('./installation/installation.component').then(m => m.InstallationComponent),
      },
      {
        path: 'theming',
        loadComponent: () => import('./theming/theming.component').then(m => m.ThemingComponent),
      },
      {
        path: '',
        redirectTo: 'getting-started',
        pathMatch: 'full'
      }
    ]
  }
];
