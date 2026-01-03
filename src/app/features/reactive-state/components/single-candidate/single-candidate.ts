import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CandidatesService } from '../../services/candidates.service';

@Component({
  selector: 'app-single-candidate',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './single-candidate.html',
  styleUrl: './single-candidate.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleCandidate {
  private readonly route = inject(ActivatedRoute);
  private readonly candidatesService = inject(CandidatesService);

  // Le chapitre suivant utilisera l'id + service pour sélectionner un candidat
}
