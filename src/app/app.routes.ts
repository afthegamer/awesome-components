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
  {
    path: 'reactive-state',
    loadChildren: () =>
      import('./features/reactive-state/reactive-state.routes').then(
        (m) => m.REACTIVE_STATE_ROUTES,
      ),
  },
  { path: '**', redirectTo: 'social-media' },
];
