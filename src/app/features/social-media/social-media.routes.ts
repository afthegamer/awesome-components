import { Routes } from '@angular/router';

export const SOCIAL_MEDIA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/social-media/social-media').then((m) => m.SocialMedia),
  },
];
