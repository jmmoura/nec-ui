import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from 'src/app/model/Role';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoginPage = state.url.includes('login');

  if (isLoginPage) {
    if (authService.isLoggedIn()) {
      const params = state.root.queryParams;
      if (params && params['sharedLink']) {
        authService.logout();
        router.navigate(['/login'], { queryParams: { sharedLink: params['sharedLink'] } });
        return false;
      }
      if (user?.role === Role.ADMIN) {
        router.navigate(['/home']);
      } else if (user?.role === Role.CONDUCTOR || user?.role === Role.PUBLISHER) {
        router.navigate(['territory-details']);
      }
      return false;
    }
    return true;
  }

  if (authService.isLoggedIn()) {
    const roles = route.data['roles'] as Array<Role> | undefined; 
    if (!roles || roles?.includes(user?.role)) {
      return true;
    }

    if (user?.role === Role.CONDUCTOR || user?.role === Role.PUBLISHER) {  
      router.navigate(['territory-details']);
    }
    return false;
  }

  router.navigate(['/login']);
  return false;

};
