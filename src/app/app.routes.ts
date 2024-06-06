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
    path: 'address',
    loadComponent: () =>
      import('./address-form/address-form.component').then(
        (c) => c.AddressFormComponent
      ),
    title: 'Address',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard]
  },
  {
    path: 'table',
    loadComponent: () =>
      import('./table/table.component').then(
        (c) => c.TableComponent
      ),
    title: 'Table',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard]
  },
  {
    path: 'tree',
    loadComponent: () =>
      import('./tree/tree.component').then(
        (c) => c.TreeComponent
      ),
    title: 'Tree',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard]
  },
  {
    path: 'drag-drop',
    loadComponent: () =>
      import('./drag-drop/drag-drop.component').then(
        (c) => c.DragDropComponent
      ),
    title: 'Drag-Drop',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard]
  },
];
