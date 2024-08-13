import { Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {LoginComponent} from "./components/login/login.component";
import {loggedInGuard} from "./guards/loggedIn/logged-in.guard";

export const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate: [loggedInGuard], data: { requiresAuth: true }},
  {path: 'login', component: LoginComponent, canActivate: [loggedInGuard], data: { requiresAuth: false }},
  {path: '**', redirectTo: 'dashboard'}
];
