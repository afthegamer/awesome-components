import { Routes } from '@angular/router';
import { CandidateList } from './components/candidate-list/candidate-list';
import { SingleCandidate } from './components/single-candidate/single-candidate';
import { CandidatesService } from './services/candidates.service';

export const REACTIVE_STATE_ROUTES: Routes = [
  {
    path: '',
    providers: [CandidatesService],
    children: [
      { path: 'candidates', component: CandidateList },
      { path: 'candidates/:id', component: SingleCandidate },
      { path: '', pathMatch: 'full', redirectTo: 'candidates' },
    ],
  },
];
