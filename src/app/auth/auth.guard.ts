import {CanActivateChildFn, CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";


const authGuardImpl = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']).then(r => console.log('navigated to login'));
    return false;
  }
};

export const authGuard: CanActivateFn = (route, state) => authGuardImpl();
export const authChildGuard: CanActivateChildFn = (route, state) => authGuardImpl();
