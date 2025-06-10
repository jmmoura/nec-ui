import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'note-no-one-home',
    loadComponent: () => import('./note-no-one-home/note-no-one-home.page').then((m) => m.NoteNoOneHomePage),
  },
  {
    path: 'manage-territories',
    loadComponent: () => import('./manage-territories/manage-territories.page').then((m) => m.ManageTerritoriesPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'territory-details',
    loadComponent: () => import('./territory-details/territory-details.page').then((m) => m.TerritoryDetailsPage),
  },
  {
    path: 'blocks',
    loadComponent: () => import('./blocks/blocks.page').then((m) => m.BlocksPage),
  },
  { path: 'manage-territories',
    loadComponent: () => import('./manage-territories/manage-territories.page').then((m) => m.ManageTerritoriesPage)
  },
];
