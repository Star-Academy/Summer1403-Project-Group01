import { Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {LoginComponent} from "./components/login/login.component";
import {loggedInGuard} from "./guards/loggedIn/logged-in.guard";
import {ProfileComponent} from "./components/dashboard/profile/profile.component";
import {EditProfileComponent} from "./components/dashboard/edit-profile/edit-profile.component";
import {ChangePasswordComponent} from "./components/dashboard/change-password/change-password.component";
import {ManageUsersComponent} from "./components/dashboard/manage-users/manage-users.component";
import {ShowDataComponent} from "./components/dashboard/show-data/show-data.component";
import {isAdminGuard} from "./guards/admin/is-admin.guard";

export const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, children: [
      {path: 'profile', component: ProfileComponent},
      {path: 'edit-profile', component: EditProfileComponent},
      {path: 'change-password', component: ChangePasswordComponent},
      {path: 'manage-users', component: ManageUsersComponent, canActivate: [isAdminGuard]},
      {path: 'show-data', component: ShowDataComponent},
    ], canActivate: [loggedInGuard], data: { requiresAuth: true } },
  {path: 'login', component: LoginComponent, canActivate: [loggedInGuard], data: { requiresAuth: false }},
  {path: '**', redirectTo: 'dashboard'}
];
