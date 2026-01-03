import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap, take, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CandidatesService } from '../../services/candidates.service';
import { Candidate } from '../../models/candidate.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-single-candidate',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule, AsyncPipe],
  templateUrl: './single-candidate.html',
  styleUrl: './single-candidate.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleCandidate implements OnInit {
  loading$!: Observable<boolean>;
  candidate$!: Observable<Candidate | undefined>;

  private readonly candidatesService = inject(CandidatesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.loading$ = this.candidatesService.loading$;

    this.candidate$ = this.route.paramMap.pipe(
      map((pm) => Number(pm.get('id'))),
      switchMap((id) => this.candidatesService.getCandidateById(id)),
    );
  }

  onRefuse(): void {
    this.candidate$
      .pipe(
        take(1),
        tap((candidate) => {
          this.candidatesService.refuseCandidate(candidate!.id);
          this.onGoBack();
        }),
      )
      .subscribe();
  }

  onHire(): void {
    this.candidate$
      .pipe(
        take(1),
        tap((candidate) => {
          this.candidatesService.hireCandidate(candidate!.id);
          this.onGoBack();
        }),
      )
      .subscribe();
  }

  onGoBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
