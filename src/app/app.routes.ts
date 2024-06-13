import {Routes} from '@angular/router';
import {authChildGuard, authGuard} from './auth/auth.guard';

export const appRoutes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(
        (c) => c.LoginComponent
      ),
    title: 'Login'
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then(
        (c) => c.RegisterComponent
      ),
    title: 'Register'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    title: 'Dashboard',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then(
        (c) => c.ProfileComponent
      ),
    title: 'Profile',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard]
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./table/table.component').then(
        (c) => c.TableComponent
      ),
    title: 'Summary of Emissions',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard]
  }
];
