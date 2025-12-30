import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'social-media', pathMatch: 'full' },
  {
    path: 'social-media',
    loadChildren: () =>
      import('./features/social-media/social-media.routes').then((m) => m.SOCIAL_MEDIA_ROUTES),
  },
  {
    path: 'complex-form',
    loadChildren: () =>
      import('./features/complex-form/complex-form.routes').then((m) => m.COMPLEX_FORM_ROUTES),
  },
  { path: '**', redirectTo: 'social-media' },
];
