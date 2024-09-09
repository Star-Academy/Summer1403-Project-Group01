import { Routes } from '@angular/router';
import { loggedInGuard } from './guards/loggedIn/logged-in.guard';
import { isAdminGuard } from './guards/admin/is-admin.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { path: 'home', loadComponent: () => import('./components/dashboard/dashboardhome/dashboardhome.component').then(m => m.DashboardhomeComponent) },
      { path: 'profile', loadComponent: () => import('./components/dashboard/profile/profile.component').then(m => m.ProfileComponent), children: [
          { path: 'edit-profile', loadComponent: () => import('./components/dashboard/profile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent) },
          { path: 'change-password', loadComponent: () => import('./components/dashboard/profile/change-password/change-password.component').then(m => m.ChangePasswordComponent) }
        ]},
      { path: 'manage-users', loadComponent: () => import('./components/dashboard/manage-users/manage-users.component').then(m => m.ManageUsersComponent), canActivate: [isAdminGuard] },
      { path: 'show-data', loadComponent: () => import('./components/dashboard/show-data/show-data.component').then(m => m.ShowDataComponent) }
    ],
    canActivate: [loggedInGuard],
    data: { requiresAuth: true }
  },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent), canActivate: [loggedInGuard], data: { requiresAuth: false } },
  { path: '**', redirectTo: 'dashboard' }
];
