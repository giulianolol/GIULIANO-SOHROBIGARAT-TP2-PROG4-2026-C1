import { Routes } from '@angular/router';
import { DashboardUsuarios } from './pages/dashboard-usuarios/dashboard-usuarios';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { Perfil } from './pages/perfil/perfil';
import { CrearPublicacion } from './features/publicaciones/crear-publicacion/crear-publicacion';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardEstadisticas } from './pages/dashboard-estadisticas/dashboard-estadisticas';
import { adminGuard } from './core/guards/admin-guard';
import { notFoundGuard } from './core/guards/not-found-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },

  {
    path: 'publicaciones',
    component: Publicaciones,
    canActivate: [AuthGuard],
  },
  {
    path: 'publicaciones/nueva',
    component: CrearPublicacion,
    canActivate: [AuthGuard],
  },
  {
    path: 'perfil',
    component: Perfil,
    canActivate: [AuthGuard],
  },
  {
    path: 'publicaciones/:id',
    loadComponent: () =>
      import(
        './pages/publicaciones/detalle-publicacion/detalle-publicacion'
      ).then(c => c.DetallePublicacion),
    canActivate: [AuthGuard],
  },
{
  path: 'dashboard-usuarios',
  component: DashboardUsuarios,
  canActivate: [AuthGuard, adminGuard],
},
{
  path: 'dashboard-estadisticas',
  component: DashboardEstadisticas,
  canActivate: [AuthGuard, adminGuard],
},
{
    path: '**',
    component: Login,
    canActivate: [notFoundGuard],
  },
];