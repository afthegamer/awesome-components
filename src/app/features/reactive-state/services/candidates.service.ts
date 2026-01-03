// src/app/features/reactive-state/services/candidates.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Candidate } from '../models/candidate.model';

@Injectable()
export class CandidatesService {
  private readonly http = inject(HttpClient);

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private readonly candidatesSubject = new BehaviorSubject<Candidate[]>([]);
  readonly candidates$ = this.candidatesSubject.asObservable();

  private setLoadingStatus(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  // Le reste (fetch, getById, etc.) viendra au prochain chapitre
}
