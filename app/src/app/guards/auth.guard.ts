// ng generate guard guards/auth --implements CanActivate
import { CanActivateFn, Router } from '@angular/router'; // Import router is same than NavController
import { AuthService } from '../services/auth-user.service';
import { Injectable, inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.getLocalStorageItem('uid')) {
    console.log("buscando guard");
    console.log('Guard: ' + authService.getLocalStorageItem('uid'));
    return true;
  } else {
    console.log('No se registra Guard');
    router.navigate(['/login']);
    return false;
  }
};
