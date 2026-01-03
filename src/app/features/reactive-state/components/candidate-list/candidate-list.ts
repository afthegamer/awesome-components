import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CandidatesService } from '../../services/candidates.service';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-list.html',
  styleUrl: './candidate-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateList {
  private readonly candidatesService = inject(CandidatesService);

  readonly loading$ = this.candidatesService.loading$;
  readonly candidates$ = this.candidatesService.candidates$;
}
