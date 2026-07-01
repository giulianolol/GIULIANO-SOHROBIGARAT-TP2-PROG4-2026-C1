import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const notFoundGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (token) {
    router.navigateByUrl('/publicaciones');
  } else {
    router.navigateByUrl('/login');
  }

  return false;

};