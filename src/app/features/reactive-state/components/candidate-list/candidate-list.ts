import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { CandidatesService } from '../../services/candidates.service';
import { Candidate } from '../../models/candidate.model';
import { CANDIDATE_SEARCH_OPTIONS, CandidateSearchKey } from '../../types/candidate-search-key';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './candidate-list.html',
  styleUrl: './candidate-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateList implements OnInit {
  readonly searchTypeOptions = CANDIDATE_SEARCH_OPTIONS;
  // Streams
  loading$!: Observable<boolean>;
  candidates$!: Observable<Candidate[]>;
  private readonly candidatesService = inject(CandidatesService);
  private readonly fb = inject(NonNullableFormBuilder);
  // Form
  readonly searchCtrl = this.fb.control('');
  readonly searchTypeCtrl = this.fb.control<CandidateSearchKey>('lastName');

  ngOnInit(): void {
    this.initObservables();
    this.candidatesService.getCandidatesFromServer();
  }

  private initObservables(): void {
    this.loading$ = this.candidatesService.loading$;

    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map((v) => v.trim().toLowerCase()),
    );

    const searchType$ = this.searchTypeCtrl.valueChanges.pipe(startWith(this.searchTypeCtrl.value));

    this.candidates$ = combineLatest([
      search$,
      searchType$,
      this.candidatesService.candidates$,
    ]).pipe(
      map(([search, searchType, candidates]) => {
        if (!search) return candidates;

        return candidates.filter((candidate) =>
          candidate[searchType].toLowerCase().includes(search),
        );
      }),
    );
  }
}
