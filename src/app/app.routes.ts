import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'apply',
    loadComponent: () => import('./components/speaker-form/speaker-form.component').then(m => m.SpeakerFormComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./components/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

