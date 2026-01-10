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
        path: 'theming',
        loadComponent: () => import('./theming/theming.component').then(m => m.ThemingComponent),
      },
      {
        path: 'components',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/components.component').then(m => m.ComponentsComponent),
          },
          {
            path: 'accordion',
            loadComponent: () => import('./components/accordion-docs/accordion-docs.component').then(m => m.AccordionDocsComponent),
          },
          {
            path: 'alert',
            loadComponent: () => import('./components/alert-docs/alert-docs.component').then(m => m.AlertDocsComponent),
          },
          {
            path: 'avatar',
            loadComponent: () => import('./components/avatar-docs/avatar-docs.component').then(m => m.AvatarDocsComponent),
          },
          {
            path: 'badge',
            loadComponent: () => import('./components/badge-docs/badge-docs.component').then(m => m.BadgeDocsComponent),
          },
          {
            path: 'breadcrumb',
            loadComponent: () => import('./components/breadcrumb-docs/breadcrumb-docs.component').then(m => m.BreadcrumbDocsComponent),
          }
        ]
      },
      {
        path: '',
        redirectTo: 'getting-started',
        pathMatch: 'full'
      }
    ]
  }
];
