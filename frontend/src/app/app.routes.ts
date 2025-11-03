import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'accounts',
        loadComponent: () => import('./accounts/account-list.component').then(m => m.AccountListComponent)
      },
      {
        path: 'accounts/new',
        loadComponent: () => import('./accounts/account-form.component').then(m => m.AccountFormComponent)
      },
      {
        path: 'accounts/edit/:id',
        loadComponent: () => import('./accounts/account-form.component').then(m => m.AccountFormComponent)
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
