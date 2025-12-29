import { Routes } from '@angular/router';
import { ComplexFormService } from './services/complex-form.service';

export const COMPLEX_FORM_ROUTES: Routes = [
  {
    path: '',
    providers: [ComplexFormService], // scope du service à la feature
    loadComponent: () =>
      import('./components/complex-form/complex-form').then((m) => m.ComplexForm),
  },
];
