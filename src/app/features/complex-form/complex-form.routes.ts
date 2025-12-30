import { Routes } from '@angular/router';
import { ComplexFormService } from './services/complex-form.service';

export const COMPLEX_FORM_ROUTES: Routes = [
  {
    path: '',
    // Recommandé en standalone-first : providers au niveau de la route/feature
    providers: [ComplexFormService],
    loadComponent: () =>
      import('./components/complex-form/complex-form').then((m) => m.ComplexForm),
  },
];
