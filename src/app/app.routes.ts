import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'social-media', pathMatch: 'full' },
  {
    path: 'social-media',
    loadChildren: () =>
      import('./features/social-media/social-media.routes').then((m) => m.SOCIAL_MEDIA_ROUTES),
  },
  { path: '**', redirectTo: 'social-media' },
];
