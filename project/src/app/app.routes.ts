import { Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {LoginComponent} from "./components/login/login.component";
import {loggedInGuard} from "./guards/loggedIn/logged-in.guard";
import {ProfileComponent} from "./components/dashboard/profile/profile.component";
import {EditProfileComponent} from "./components/dashboard/edit-profile/edit-profile.component";
import {ChangePasswordComponent} from "./components/dashboard/change-password/change-password.component";

export const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, children: [
      {path: 'profile', component: ProfileComponent},
      {path: 'edit-profile', component: EditProfileComponent},
      {path: 'change-password', component: ChangePasswordComponent},
    ], canActivate: [loggedInGuard], data: { requiresAuth: true }},
  {path: 'login', component: LoginComponent, canActivate: [loggedInGuard], data: { requiresAuth: false }},
  {path: '**', redirectTo: 'dashboard'}
];
