import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CandidatesService } from '../../services/candidates.service';
import { Candidate } from '../../models/candidate.model';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatProgressSpinnerModule, RouterLink, AsyncPipe],
  templateUrl: './candidate-list.html',
  styleUrl: './candidate-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateList implements OnInit {
  loading$!: Observable<boolean>;
  candidates$!: Observable<Candidate[]>;

  private readonly candidatesService = inject(CandidatesService);

  ngOnInit(): void {
    this.loading$ = this.candidatesService.loading$;
    this.candidates$ = this.candidatesService.candidates$;

    this.candidatesService.getCandidatesFromServer();
  }
}
