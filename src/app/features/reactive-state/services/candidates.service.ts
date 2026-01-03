import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, delay, EMPTY, finalize, map, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Candidate } from '../models/candidate.model';

@Injectable()
export class CandidatesService {
  private readonly http = inject(HttpClient);

  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _candidates$ = new BehaviorSubject<Candidate[]>([]);
  private lastCandidatesLoad = 0;

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  get candidates$(): Observable<Candidate[]> {
    return this._candidates$.asObservable();
  }

  getCandidatesFromServer(): void {
    // évite requêtes multiples simultanées
    if (this._loading$.value) return;

    // cache 5 min
    if (Date.now() - this.lastCandidatesLoad <= 300_000) return;

    this.setLoadingStatus(true);

    this.http
      .get<Candidate[]>(`${environment.apiUrl}/candidates`)
      .pipe(
        delay(1000),
        tap((candidates) => {
          this.lastCandidatesLoad = Date.now();
          this._candidates$.next(candidates);
        }),
        catchError((err) => {
          console.error('Erreur chargement candidats', err);
          return EMPTY;
        }),
        finalize(() => this.setLoadingStatus(false)),
      )
      .subscribe();
  }

  getCandidateById(id: number): Observable<Candidate | undefined> {
    // si on arrive direct sur /:id (refresh), on déclenche un chargement
    if (!this.lastCandidatesLoad) {
      this.getCandidatesFromServer();
    }

    return this.candidates$.pipe(map((candidates) => candidates.find((c) => c.id === id)));
  }

  private setLoadingStatus(loading: boolean): void {
    this._loading$.next(loading);
  }
}
