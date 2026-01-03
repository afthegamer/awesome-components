import { Routes } from '@angular/router';
import { CandidatesService } from './services/candidates.service';

export const REACTIVE_STATE_ROUTES: Routes = [
  {
    path: '',
    providers: [CandidatesService],
    children: [
      {
        path: 'candidates',
        loadComponent: () =>
          import('./components/candidate-list/candidate-list').then((m) => m.CandidateList),
      },
      {
        path: 'candidates/:id',
        loadComponent: () =>
          import('./components/single-candidate/single-candidate').then((m) => m.SingleCandidate),
      },
      { path: '', pathMatch: 'full', redirectTo: 'candidates' },
    ],
  },
];
