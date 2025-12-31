import {Routes} from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  {
    path: '',
    loadComponent: () => import('./index/index.component').then(c => c.IndexComponent)
  }
]
