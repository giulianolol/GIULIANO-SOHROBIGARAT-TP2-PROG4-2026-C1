import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { Perfil } from './pages/perfil/perfil';
import { CrearPublicacion } from './features/publicaciones/crear-publicacion/crear-publicacion';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
  path: 'publicaciones/nueva',
  component: CrearPublicacion,
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
  },
  {
    path: 'perfil',
    component: Perfil,
  },
];