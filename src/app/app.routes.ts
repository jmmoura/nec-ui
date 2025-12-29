import { Routes } from '@angular/router';
import { authGuard } from './service/authentication/auth.guard';
import { Role } from './model/Role';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [ authGuard ],
    data: { roles: [ Role.ADMIN ] }
  },
  {
    path: 'note-no-one-home',
    loadComponent: () => import('./note-no-one-home/note-no-one-home.page').then((m) => m.NoteNoOneHomePage),
    canActivate: [ authGuard ],
    data: { roles: [ Role.ADMIN ] }
  },
  {
    path: 'manage-territories',
    loadComponent: () => import('./manage-territories/manage-territories.page').then((m) => m.ManageTerritoriesPage),
    canActivate: [ authGuard ],
    data: { roles: [ Role.ADMIN ] }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'territory-details',
    loadComponent: () => import('./territory-details/territory-details.page').then((m) => m.TerritoryDetailsPage),
    canActivate: [ authGuard ],
    data: { roles: [ Role.ADMIN, Role.CONDUCTOR, Role.PUBLISHER ] }
  },
  {
    path: 'blocks',
    loadComponent: () => import('./blocks/blocks.page').then((m) => m.BlocksPage),
    canActivate: [ authGuard ],
    data: { roles: [ Role.ADMIN, Role.CONDUCTOR, Role.PUBLISHER ] }
  },
  { path: 'manage-persons',
    loadComponent: () => import('./manage-persons/manage-persons.page').then((m) => m.ManagePersonsPage),
    canActivate: [ authGuard ],
    data: { roles: [ Role.ADMIN ] }
  },
  {
    path: 'manage-persons',
    loadComponent: () => import('./manage-persons/manage-persons.page').then( m => m.ManagePersonsPage),
    canActivate: [ authGuard ],
    data: { roles: [ Role.ADMIN ] }
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage),
    canActivate: [ authGuard ]
  }
];
